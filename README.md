# MILORA — E-Commerce

## Prérequis
- Node.js 18+
- PostgreSQL 14+
- Compte Stripe

## Installation

### 1. Base de données
```bash
psql -U postgres
CREATE DATABASE milora;
\c milora
\i backend/db/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Remplir les variables dans .env
npm start
```

## Variables d'environnement

### backend/.env
```
PORT=5000
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/milora
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

## Lancer le projet
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

## URLs
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000/api

## Stripe (test)
- Carte test : 4242 4242 4242 4242
- Date : n'importe quelle date future
- CVC : n'importe quel 3 chiffres

## Déploiement
- Frontend : Vercel ou Netlify
- Backend : Railway ou Render
- Base de données : Supabase ou Railway PostgreSQL
