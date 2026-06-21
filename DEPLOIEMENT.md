# Déploiement de Milora

Ce projet est un **monorepo à deux services** :

- `frontend/` → application **Create React App** = site **statique** → idéal pour **Vercel**
- `backend/` → serveur **Express** (Node) qui tourne en continu + **PostgreSQL** + **Stripe** + upload de fichiers

> ⚠️ **Pourquoi seul le frontend se déployait sur Vercel ?**
> Vercel ne fait pas tourner un serveur Express qui écoute en continu (`app.listen`).
> De plus, l'ancien `vercel.json` utilisait une clé `experimentalServices` **qui n'existe pas**
> dans Vercel : elle était simplement ignorée. Résultat : seul le React était construit.

La solution recommandée découpe le déploiement en **3 briques** :

| Brique | Plateforme | Pourquoi |
|--------|-----------|----------|
| `frontend/` | **Vercel** | statique, parfait |
| `backend/` (Express) | **Render** (Web Service) | fait tourner `node server.js` en continu |
| PostgreSQL | **Neon** | gratuit durablement (le Postgres gratuit de Render expire au bout de 30 jours) |

---

## 1. Base de données — Neon

1. Créer un projet sur [neon.tech](https://neon.tech) (gratuit).
2. Copier la **connection string** (elle contient `?sslmode=require`).
3. Exécuter le contenu de [`backend/db/schema.sql`](backend/db/schema.sql) dans l'**éditeur SQL** de Neon
   pour créer les tables.

---

## 2. Backend — Render

Le fichier [`render.yaml`](render.yaml) (Blueprint) est fourni à la racine. Sur Render :

1. **New → Blueprint** (ou **New → Web Service** en configuration manuelle) et connecter ce repo GitHub.
2. Si configuration manuelle :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
3. Renseigner les **variables d'environnement** (onglet *Environment*) :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | la connection string Neon |
   | `STRIPE_SECRET_KEY` | `sk_live_...` ou `sk_test_...` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
   | `FRONTEND_URL` | `https://<ton-site>.vercel.app` |

   > Pas besoin de définir `PORT` : Render l'injecte automatiquement et le code lit déjà `process.env.PORT`.

À la fin, Render fournit une URL du type `https://milora-backend.onrender.com`.

---

## 3. Frontend — Vercel

1. Dans les **Settings** du projet Vercel → **Root Directory** = `frontend`.
2. Ajouter la variable d'environnement :

   ```
   REACT_APP_API_URL=https://milora-backend.onrender.com
   ```

3. **Redéployer**. Aucun changement de code nécessaire : le frontend lit déjà
   `process.env.REACT_APP_API_URL` partout.

> Le fichier [`frontend/vercel.json`](frontend/vercel.json) ajoute une règle de *rewrite* pour que
> les routes React Router (ex. `/produit`, `/panier`) fonctionnent même en rechargeant la page.

---

## 4. Stripe

Recréer le **webhook** dans le dashboard Stripe en le pointant vers :

```
https://milora-backend.onrender.com/api/stripe/webhook
```

Puis mettre à jour `STRIPE_WEBHOOK_SECRET` sur Render avec le secret du nouveau webhook.

---

## ⚠️ Deux pièges à connaître

### 1. Les photos d'avis vont disparaître

Le backend enregistre les photos d'avis sur le **disque local** via `multer.diskStorage`
(`backend/routes/reviews.js` → dossier `uploads/reviews/`).
Or **le disque de Render est éphémère** : à chaque redéploiement ou redémarrage du service,
ce dossier est effacé. Les photos seront donc perdues.

**Solutions :**
- **Recommandé (gratuit) :** envoyer les uploads vers **Cloudinary** au lieu du disque local.
- Ou activer un **Persistent Disk** sur Render (payant, ~7 $/mois).

> Cette modification touche au code métier (`backend/routes/reviews.js`) et n'est pas incluse
> dans cette PR — à décider/implémenter séparément.

### 2. Cold start du plan gratuit Render

Sur le plan gratuit, le service **s'endort après 15 min sans trafic**. La première requête après
réveil prend ~30-50 s. Acceptable pour une démo. Pour de la prod : plan payant (7 $/mois) ou un
cron qui appelle régulièrement `/api/health`.

---

## Alternative « tout Vercel » (non retenue ici)

Vercel sait aujourd'hui faire tourner du backend Node. On *pourrait* tout y mettre, mais il
faudrait restructurer le backend en fonctions serverless (le `app.listen` actuel ne marche pas
tel quel). C'est plus de travail que Render. **Render reste le chemin le plus court** ici.
