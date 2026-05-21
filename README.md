# MILORA — E-Commerce de Body Gainant

![MILORA](./frontend/public/images/hero.jpeg)

> Projet e-commerce complet développé de A à Z : frontend React.js, backend Node.js/Express, base de données PostgreSQL et paiement Stripe.

---

## 🎯 Présentation du projet

**MILORA** est une boutique en ligne spécialisée dans la vente de bodysuits gainants pour femmes. Ce projet a été conçu et développé dans le cadre de la création d'un portfolio professionnel démontrant la capacité à livrer une application web e-commerce complète et production-ready.

L'objectif était de créer une expérience d'achat fluide, moderne et optimisée pour la conversion, avec une identité visuelle forte et féminine.

---

## ✨ Fonctionnalités

### Côté client
- 🏠 **Page d'accueil** avec hero plein écran, sections produit, avant/après, bandeau défilant, FAQ
- 🛍️ **Page produit** avec galerie photos interactive (miniatures cliquables), sélecteur de taille et quantité
- 🛒 **Panier** dynamique persistant (session anonyme via localStorage)
- 💳 **Paiement sécurisé** via Stripe Checkout (redirection)
- 📦 **Suivi de commande** par numéro + email
- ⭐ **Avis clients** avec photos UGC, lightbox, formulaire de soumission avec upload photo
- 📬 **Newsletter** avec offre -10% en échange de l'email
- 📩 **Formulaire de contact** avec confirmation

### Côté administration
- ✅ Modération des avis clients (validation manuelle avant publication)
- 📊 Webhook Stripe pour mise à jour automatique du statut des commandes

---

## 🛠️ Stack technique

| Couche | Technologie | Usage |
|--------|-------------|-------|
| Frontend | React.js 18 | Interface utilisateur |
| Routing | React Router v6 | Navigation SPA |
| State | Context API | Gestion du panier global |
| HTTP Client | Axios | Appels API |
| Backend | Node.js + Express | API REST |
| Base de données | PostgreSQL | Stockage des données |
| Paiement | Stripe Checkout | Tunnel d'achat sécurisé |
| Upload fichiers | Multer | Photos avis clients |
| CSS | CSS-in-JS + classes globales | Styles composants |
| Fonts | Google Fonts (Inter) | Typographie |

---

## 📁 Structure du projet

```
milora/
├── frontend/                    ← React.js (port 3000)
│   ├── public/
│   │   └── images/              ← Photos produit et avis clients
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx         ← Accueil (7 sections)
│       │   ├── Product.jsx      ← Page produit + galerie
│       │   ├── Cart.jsx         ← Panier + Stripe
│       │   ├── Contact.jsx      ← Formulaire contact
│       │   ├── Tracking.jsx     ← Suivi commande
│       │   ├── Reviews.jsx      ← Avis + formulaire + lightbox
│       │   ├── Success.jsx      ← Confirmation paiement
│       │   └── Failure.jsx      ← Échec paiement
│       ├── components/
│       │   ├── Navbar.jsx       ← Navigation sticky responsive
│       │   ├── Footer.jsx       ← Footer + newsletter
│       │   ├── ProductCard.jsx  ← Carte produit réutilisable
│       │   ├── ReviewsSection.jsx ← Grille UGC accueil
│       │   └── FAQ.jsx          ← Accordéon FAQ
│       ├── context/
│       │   └── CartContext.jsx  ← État global panier
│       ├── App.jsx              ← Routing
│       └── index.css            ← Styles globaux
│
├── backend/                     ← Node.js + Express (port 5000)
│   ├── server.js                ← Point d'entrée
│   ├── db/
│   │   ├── pool.js              ← Connexion PostgreSQL
│   │   └── schema.sql           ← Schéma + données initiales
│   ├── routes/
│   │   ├── products.js          ← CRUD produits
│   │   ├── cart.js              ← Gestion panier
│   │   ├── orders.js            ← Commandes
│   │   ├── newsletter.js        ← Inscription newsletter
│   │   ├── contact.js           ← Messages contact
│   │   ├── reviews.js           ← Avis + modération
│   │   └── stripe.js            ← Checkout + webhook
│   └── uploads/reviews/         ← Photos uploadées par clients
│
└── README.md
```

---

## 🗄️ Base de données

7 tables PostgreSQL :

```sql
products          → Catalogue produits
product_sizes     → Tailles disponibles par produit
cart              → Panier anonyme (session_id)
orders            → Commandes clients
order_items       → Détail articles par commande
newsletter        → Emails inscrits
contacts          → Messages formulaire contact
reviews           → Avis clients (avec modération)
```

---

## 🚀 Installation et lancement

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Compte Stripe (gratuit)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/milora.git
cd milora
```

### 2. Base de données
```bash
psql -U postgres
CREATE DATABASE milora;
\c milora
\i backend/db/schema.sql
```

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
```

Remplir le fichier `.env` :
```env
PORT=5000
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/milora
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

### 4. Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

Remplir le fichier `.env` :
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

```bash
npm start
```

### 5. Stripe webhook (en local)
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

---

## 🌐 Pages et routes

| URL | Description |
|-----|-------------|
| `/` | Accueil |
| `/produit` | Page produit |
| `/panier` | Panier |
| `/contact` | Contact |
| `/suivi` | Suivi de commande |
| `/avis` | Avis clients |
| `/merci` | Confirmation paiement |
| `/echec` | Échec paiement |

---

## 🔌 API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products` | Liste produits |
| GET | `/api/products/:id` | Détail produit |
| GET | `/api/cart/:sessionId` | Récupérer panier |
| POST | `/api/cart` | Ajouter au panier |
| PUT | `/api/cart/:itemId` | Modifier quantité |
| DELETE | `/api/cart/:itemId` | Supprimer article |
| POST | `/api/orders` | Créer commande |
| GET | `/api/orders/:id` | Suivi commande |
| POST | `/api/newsletter` | Inscription newsletter |
| POST | `/api/contact` | Envoyer message |
| GET | `/api/reviews` | Avis approuvés |
| POST | `/api/reviews` | Soumettre avis + photo |
| PATCH | `/api/reviews/:id/approve` | Valider avis (admin) |
| DELETE | `/api/reviews/:id` | Supprimer avis (admin) |
| POST | `/api/stripe/checkout` | Créer session paiement |
| POST | `/api/stripe/webhook` | Webhook Stripe |

---

## 💳 Test du paiement Stripe

```
Carte test : 4242 4242 4242 4242
Date       : n'importe quelle date future
CVC        : n'importe quel 3 chiffres
```

---

## ⚡ Difficultés rencontrées et solutions

### 1. Panier persistant sans authentification
**Problème :** Conserver le panier d'un utilisateur non connecté entre les pages.  
**Solution :** Génération d'un `sessionId` unique stocké dans le `localStorage` du navigateur, utilisé comme clé d'identification côté backend dans la table `cart`.

### 2. Webhook Stripe et ordre des middlewares Express
**Problème :** Stripe exige de recevoir le body brut (non parsé) pour valider la signature du webhook, mais Express parse le body en JSON par défaut.  
**Solution :** Appliquer `express.raw()` uniquement sur la route `/api/stripe/webhook`, **avant** le middleware `express.json()` global.

### 3. Upload de photos avec modération
**Problème :** Permettre aux clients d'uploader des photos d'avis sans publier du contenu non modéré.  
**Solution :** Multer pour la gestion des fichiers + champ `status` en base (`en_attente` / `approuve`). Les avis sont filtrés côté API avant affichage.

### 4. Galerie produit interactive
**Problème :** Afficher plusieurs angles du produit avec une navigation fluide.  
**Solution :** État local React avec `useState` pour l'index de la photo active, grille de miniatures cliquables avec bordure de sélection dynamique.

### 5. Lightbox avis clients
**Problème :** Afficher un avis en plein écran sans librairie externe pour garder le bundle léger.  
**Solution :** Lightbox custom en CSS-in-JS avec `position: fixed` et gestion du clic extérieur pour fermer.

---

## 🎨 Choix de design

- **Minimaliste** : fond blanc dominant, noir pour les textes et CTA, rouge corail uniquement pour les badges promo
- **UGC (User Generated Content)** : section avis avec vraies photos clients en format portrait, style Instagram
- **Typographie épurée** : Inter (Google Fonts), poids 300-600
- **Animations légères** : transitions CSS sur les hovers, scale sur les images, overlay progressif

---

## 📦 Déploiement recommandé

| Service | Usage | Prix |
|---------|-------|------|
| Vercel | Frontend React | Gratuit |
| Railway | Backend Node.js | ~5$/mois |
| Railway PostgreSQL | Base de données | ~5$/mois |
| Cloudinary | Stockage images (optionnel) | Gratuit |

---

## 👤 Auteur

Développé dans le cadre d'un projet portfolio e-commerce fullstack.

---

## 📄 Licence

MIT — libre d'utilisation et de modification.