# MILORA — Explication complète du code

---

## ARCHITECTURE GÉNÉRALE

```
Navigateur (React)  ←→  Backend (Express)  ←→  Base de données (PostgreSQL)
     port 3000               port 5000               Neon / local
```

Le projet est découpé en deux parties indépendantes :
- **Frontend** : ce que l'utilisateur voit (React.js)
- **Backend** : le serveur qui gère les données (Node.js + Express)

Ils communiquent via des **requêtes HTTP** (axios côté frontend → Express côté backend).

---

## BASE DE DONNÉES — `backend/db/schema.sql`

Le fichier SQL crée toutes les tables et insère les données de départ.

```sql
CREATE TABLE products (...)
```
Table principale des produits. Contient le nom, la description, le prix actuel (`price`), le prix barré (`original_price`), le stock total et l'URL de l'image.

```sql
CREATE TABLE product_sizes (product_id REFERENCES products(id) ON DELETE CASCADE, ...)
```
Les tailles disponibles pour chaque produit. `REFERENCES products(id)` crée un lien entre les deux tables. `ON DELETE CASCADE` signifie : si on supprime un produit, ses tailles sont automatiquement supprimées aussi.

```sql
CREATE TABLE cart (session_id VARCHAR(255), ...)
```
Le panier anonyme. Chaque visiteur est identifié par un `session_id` généré aléatoirement et stocké dans son navigateur (localStorage). Pas besoin de compte.

```sql
CREATE TABLE orders (order_number VARCHAR(50) UNIQUE, status VARCHAR(50) DEFAULT 'en_attente', ...)
```
Les commandes après paiement. `UNIQUE` sur `order_number` empêche deux commandes d'avoir le même numéro. Le statut passe de `en_attente` à `payee` quand Stripe confirme le paiement.

```sql
CREATE TABLE order_items (order_id REFERENCES orders(id), ...)
```
Le détail de chaque commande (quels produits, quelles tailles, quelles quantités).

```sql
CREATE TABLE reviews (status VARCHAR(20) DEFAULT 'en_attente', ...)
```
Les avis clients. Par défaut en `en_attente`, ils ne sont visibles publiquement qu'après modération (`approuve`).

```sql
INSERT INTO products (...) VALUES (...)
```
Insère le produit initial "Bodysuit MILORA" avec son prix et son stock.

---

## BACKEND — `backend/db/pool.js`

```js
const { Pool } = require('pg');
```
Importe le module `pg` (PostgreSQL pour Node.js).

```js
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```
Crée un "pool" de connexions à la base de données. Un pool maintient plusieurs connexions ouvertes pour les réutiliser, ce qui est plus rapide que d'ouvrir une nouvelle connexion à chaque requête. L'URL de la base vient du fichier `.env`.

```js
pool.on('error', (err) => { console.error(...) });
```
Si une connexion inactive plante, on log l'erreur au lieu de faire crasher le serveur.

---

## BACKEND — `backend/server.js`

```js
require('dotenv').config();
```
Charge les variables du fichier `.env` (DATABASE_URL, STRIPE_SECRET_KEY, etc.) dans `process.env`.

```js
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
```
Le webhook Stripe doit recevoir le corps de la requête en **brut** (raw bytes) pour pouvoir vérifier la signature. Cette ligne doit être avant `express.json()`, sinon Stripe ne peut pas valider que la requête vient bien de lui.

```js
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
```
Autorise le frontend à appeler le backend. Sans CORS, le navigateur bloquerait les requêtes entre `localhost:3000` et `localhost:5000`.

```js
app.use(express.json());
```
Parse automatiquement le corps des requêtes en JSON (pour lire `req.body`).

```js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
Sert les fichiers statiques du dossier `uploads/` (photos uploadées par les clients pour les avis). Ex: `http://localhost:5000/uploads/reviews/photo.jpg`.

```js
app.use('/api/products', require('./routes/products'));
```
Monte la route `/api/products`. Toutes les routes définies dans `routes/products.js` seront accessibles sous ce préfixe.

---

## BACKEND — `backend/routes/products.js`

```js
const router = express.Router();
```
Crée un mini-routeur isolé. On définit les routes dessus, puis on l'exporte pour le monter dans `server.js`.

```js
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) AS sizes
    FROM products p
    LEFT JOIN product_sizes ps ON ps.product_id = p.id
    GROUP BY p.id
  `);
```
Récupère tous les produits avec leurs tailles sous forme de tableau JSON. `json_agg` + `json_build_object` construisent directement `[{"size":"S","stock":30}, ...]` dans la requête SQL. `LEFT JOIN` inclut les produits même s'ils n'ont pas de tailles. `GROUP BY p.id` est nécessaire pour agréger les tailles par produit.

```js
router.get('/:id', ...)
```
`:id` est un paramètre dynamique. Si on appelle `/api/products/1`, alors `req.params.id` vaut `"1"`. La requête SQL utilise `$1` comme placeholder (protection contre les injections SQL).

---

## BACKEND — `backend/routes/cart.js`

```js
router.get('/:sessionId', ...)
```
Récupère le panier d'un visiteur par son `session_id`. Joint la table `products` pour avoir le nom et le prix à jour.

```js
router.post('/', async (req, res) => {
  const existing = await pool.query(
    'SELECT * FROM cart WHERE session_id=$1 AND product_id=$2 AND size=$3', ...
  );
  if (existing.rows[0]) {
    // Incrémente la quantité si l'article existe déjà
  } else {
    // Insère un nouvel article
  }
```
Logique intelligente : si le produit dans la même taille est déjà dans le panier, on incrémente la quantité au lieu de créer un doublon.

```js
router.put('/:itemId', async (req, res) => {
  if (quantity <= 0) {
    await pool.query('DELETE FROM cart WHERE id=$1', ...);
```
Si la nouvelle quantité est 0 ou moins, on supprime l'article. Cela permet au frontend d'appeler `updateItem(id, 0)` pour supprimer.

---

## BACKEND — `backend/routes/stripe.js`

```js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```
Initialise la librairie Stripe avec la clé secrète. Cette clé ne doit jamais être exposée côté frontend.

```js
const lineItems = cartItems.map((item) => ({
  price_data: {
    currency: 'eur',
    product_data: { name: `${item.name} — Taille ${item.size}` },
    unit_amount: Math.round(item.price * 100), // Stripe travaille en centimes
  },
  quantity: item.quantity,
}));
```
Transforme les articles du panier au format attendu par Stripe. Stripe travaille en **centimes** (pas en euros), donc `14.99 * 100 = 1499 centimes`.

```js
const session = await stripe.checkout.sessions.create({
  success_url: `${process.env.FRONTEND_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/echec`,
  metadata: { cart_session_id: sessionId },
  shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
});
res.json({ url: session.url });
```
Crée une session Stripe et renvoie l'URL de paiement. Le frontend redirige l'utilisateur vers cette URL. `{CHECKOUT_SESSION_ID}` est un placeholder que Stripe remplace automatiquement dans l'URL de succès. `metadata` stocke le `session_id` du panier pour le retrouver dans le webhook.

```js
router.post('/webhook', async (req, res) => {
  event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
```
Le webhook est appelé par Stripe (pas par le frontend) quand un paiement est confirmé. `constructEvent` vérifie la signature pour s'assurer que la requête vient bien de Stripe et pas d'un attaquant.

```js
if (event.type === 'checkout.session.completed') {
  // 1. Récupère les articles du panier
  // 2. Crée la commande en base
  // 3. Vide le panier
}
```
Quand Stripe confirme le paiement, on crée la commande dans la base de données et on vide le panier du client.

---

## BACKEND — `backend/routes/orders.js`

```js
const client = await pool.connect();
await client.query('BEGIN');
// ... plusieurs INSERT
await client.query('COMMIT');
```
**Transaction SQL** : soit toutes les opérations réussissent ensemble, soit aucune. Si l'insertion des `order_items` plante, le `ROLLBACK` annule aussi l'insertion de la commande. Évite d'avoir une commande sans articles en base.

```js
router.get('/:orderNumber', async (req, res) => {
  const { email } = req.query;
  // WHERE o.order_number=$1 AND o.email=$2
```
Page de suivi de commande. La double vérification (`order_number` + `email`) évite qu'un utilisateur accède à la commande d'un autre en devinant le numéro.

---

## FRONTEND — `frontend/src/index.css`

```css
:root {
  --black: #0a0a0a;
  --white: #ffffff;
  --red: #e63946;
}
```
Variables CSS globales. Définies une seule fois et utilisables partout avec `var(--black)`. Si on veut changer la couleur principale, on ne modifie qu'ici.

```css
.btn-black { background: var(--black); color: var(--white); ... }
.btn-outline { background: transparent; border: 1px solid var(--black); ... }
```
Classes réutilisables sur tous les boutons du site. Assure la cohérence visuelle.

```css
@keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.banner-track { animation: scroll-left 20s linear infinite; }
```
Animation CSS du bandeau défilant des marques. Le contenu est dupliqué (les marques apparaissent deux fois) pour créer l'effet de défilement infini sans saut visible.

---

## FRONTEND — `frontend/src/App.jsx`

```jsx
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          ...
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
```
`CartProvider` enveloppe toute l'application pour que **toutes** les pages aient accès au panier. `BrowserRouter` active la navigation React sans rechargement de page. Chaque `Route` associe une URL à un composant.

---

## FRONTEND — `frontend/src/context/CartContext.jsx`

```js
const CartContext = createContext();
```
Crée un "contexte" React — un espace global partageable entre tous les composants sans passer des props manuellement de parent en enfant.

```js
function getSessionId() {
  let id = localStorage.getItem('milora_session');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substr(2, 12);
    localStorage.setItem('milora_session', id);
  }
  return id;
}
```
Génère un identifiant unique par navigateur, stocké dans `localStorage` (persistant même après fermeture du navigateur). Ex: `sess_k3m9xz2ab1p`. Permet d'avoir un panier anonyme sans compte utilisateur.

```js
const fetchCart = async () => {
  const { data } = await axios.get(`${API}/api/cart/${sessionId}`);
  setCartItems(data);
};

useEffect(() => { fetchCart(); }, []);
```
Charge le panier depuis le serveur au premier chargement de l'application. `useEffect` avec `[]` = exécuté une seule fois au démarrage.

```js
const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
```
`reduce` parcourt tous les articles et accumule un total. `cartCount` = nombre total d'articles (pour le badge sur le panier). `cartTotal` = montant total en euros.

```js
return (
  <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, ... }}>
    {children}
  </CartContext.Provider>
);
```
Rend disponibles toutes ces valeurs et fonctions à tous les composants enfants.

```js
export const useCart = () => useContext(CartContext);
```
Hook personnalisé. Dans n'importe quel composant, on peut écrire `const { addToCart } = useCart()` pour accéder au panier.

---

## FRONTEND — `frontend/src/components/Navbar.jsx`

```js
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```
Détecte si l'utilisateur a scrollé. `window.scrollY > 10` passe à `true` dès qu'on descend de 10px. Le `return () => removeEventListener` est le **nettoyage** : quand la Navbar est démontée, on retire l'écouteur pour éviter les fuites mémoire.

```jsx
borderBottom: scrolled ? '1px solid #e5e5e5' : '1px solid transparent',
```
La bordure du bas de la navbar apparaît uniquement quand on a scrollé — effet visuel propre.

```jsx
{cartCount > 0 && (
  <span style={{ position: 'absolute', ... }}>{cartCount}</span>
)}
```
Affiche le badge rouge avec le nombre d'articles seulement si le panier n'est pas vide. `&&` en JSX = "affiche si la condition est vraie".

---

## FRONTEND — `frontend/src/pages/Home.jsx`

```jsx
const reassurance = [
  { icon: '🔄', title: 'Satisfaite ou Remboursée', desc: "30 jours..." },
  ...
];
```
Les données de réassurance sont stockées dans un tableau d'objets. On les affiche avec `.map()` au lieu de copier-coller le HTML 4 fois.

```jsx
<section style={{ position: 'relative', minHeight: '100vh', ... }}>
  <img src="/images/hero.jpeg" style={{ position: 'absolute', inset: 0, ... }} />
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(...)' }} />
  <div style={{ position: 'relative', zIndex: 2 }}>
    {/* Texte */}
  </div>
</section>
```
**Technique hero plein écran** : l'image est en `position: absolute` pour remplir tout le parent. Un calque semi-transparent (gradient noir) est posé dessus pour assombrir l'image. Le texte est en `position: relative` avec `zIndex: 2` pour apparaître au-dessus des deux couches.

```jsx
<h1 style={{ fontSize: 'clamp(42px, 8vw, 90px)' }}>
```
`clamp(min, préféré, max)` adapte la taille du texte à l'écran : jamais moins de 42px, jamais plus de 90px, et `8vw` (8% de la largeur de l'écran) entre les deux.

---

## FRONTEND — `frontend/src/pages/Product.jsx`

```js
const [activePhoto, setActivePhoto] = useState(0);
```
Stocke l'index de la photo principale affichée. Quand on clique une miniature, on met à jour cet index.

```jsx
<div style={{ border: `2px solid ${activePhoto === i ? '#0a0a0a' : 'transparent'}` }}>
```
La miniature active a une bordure noire, les autres ont une bordure transparente. Le style change dynamiquement selon l'état.

```js
const handleAdd = async () => {
  if (!selectedSize) { setError('Veuillez sélectionner une taille.'); return; }
  await addToCart(1, selectedSize, quantity);
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
};
```
Validation : si pas de taille sélectionnée, affiche un message d'erreur et arrête. Sinon ajoute au panier. `setAdded(true)` change le texte du bouton en "✓ Ajouté !". `setTimeout` remet le texte normal après 2 secondes.

---

## FRONTEND — `frontend/src/pages/Cart.jsx`

```js
const handleCheckout = async () => {
  const { data } = await axios.post(`${API}/api/stripe/checkout`, { cartItems, sessionId });
  window.location.href = data.url;
};
```
Envoie le panier au backend, qui crée une session Stripe. Le backend répond avec une URL de paiement Stripe. `window.location.href = ...` redirige l'utilisateur vers la page de paiement Stripe.

```jsx
{cartItems.length === 0 ? (
  <div>Votre panier est vide</div>
) : (
  <div>... articles ...</div>
)}
```
Affichage conditionnel : deux états possibles selon si le panier est vide ou non.

---

## FRONTEND — `frontend/src/components/Footer.jsx`

```js
const handleNewsletter = async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page (comportement par défaut des formulaires HTML)
  await axios.post(`${API}/api/newsletter`, { email });
  setSent(true);
};
```
`e.preventDefault()` est essentiel sur les formulaires React pour empêcher le navigateur de recharger la page.

```jsx
{sent ? (
  <p>✓ Merci ! Votre code promo arrive par email.</p>
) : (
  <form onSubmit={handleNewsletter}>...</form>
)}
```
Après soumission, on remplace le formulaire par un message de confirmation.

---

## RÉSUMÉ DU FLUX COMPLET D'UNE COMMANDE

```
1. Visiteur arrive sur le site
   → getSessionId() crée/récupère son ID unique dans localStorage

2. Il clique "Ajouter au panier"
   → addToCart() appelle POST /api/cart
   → Le backend vérifie si l'article existe déjà (incrémente ou insère)

3. Il va sur /panier
   → fetchCart() appelle GET /api/cart/:sessionId
   → Affiche les articles avec prix et quantités

4. Il clique "Procéder au paiement"
   → handleCheckout() appelle POST /api/stripe/checkout
   → Le backend crée une session Stripe et renvoie l'URL
   → Le navigateur redirige vers la page Stripe

5. Il paye sur Stripe
   → Stripe appelle POST /api/stripe/webhook (côté serveur, pas navigateur)
   → Le backend vérifie la signature, crée la commande, vide le panier
   → Stripe redirige vers /merci?session_id=...

6. Page /merci affichée
   → La commande est enregistrée avec statut 'payee'
```
