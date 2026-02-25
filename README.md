# Torkia Paris – Site de commande en ligne

Site de commande en ligne pour le restaurant tunisien **Torkia Paris** (79 rue Blanche, 75009 Paris).

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS 4
- **Backend:** Node.js, Express
- **Paiement:** Prêt pour Stripe (clés à configurer)

## Démarrage

```bash
# Installer toutes les dépendances (racine + frontend + backend)
npm run install:all

# Lancer frontend (port 5173) et backend (port 3001)
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance frontend + backend en parallèle |
| `npm run dev:frontend` | Lance uniquement le frontend |
| `npm run dev:backend` | Lance uniquement l’API |
| `npm run build` | Build de production du frontend |

## Architecture

| App | Role |
|-----|------|
| **backend/** | **Toutes les APIs** – Express + Prisma (PostgreSQL). Endpoints publics : menu, commandes. Endpoints admin (clé API) : dashboard stats, orders, categories, products, options. |
| **frontend/** | **Site vitrine / commande** – React (Vite). Page d’accueil, menu, panier, checkout. Appelle uniquement le backend. |
| **dashboard/** | **Interface admin uniquement** – Next.js. Tableau de bord, commandes, menu, promos, etc. Appelle uniquement le backend (lecture via `getFromBackend`, écriture via proxy API routes). |

## Structure

- `frontend/` – Application React (landing + commande) — appelle le backend pour le menu et les commandes
- `backend/` – **Seul serveur d’API** : Express + Prisma (catégories, produits, commandes, stats dashboard)
- `dashboard/` – UI admin Next.js — appelle le backend pour toutes les données (stats, commandes, menu)

## Connexion frontend ↔ backend ↔ dashboard

Toute la logique API est dans le **backend** (Express). Le **frontend** (landing) et le **dashboard** (admin) ne font qu’appeler le backend. Le dashboard utilise des routes API Next.js en **proxy** pour les écritures (catégories, produits, options, statut commandes) afin de ne pas exposer l’URL ni la clé API au client.

1. **Base de données** : le backend utilise la même base que le dashboard. Créer la base une fois depuis le dashboard :
   ```bash
   cd dashboard && cp .env.example .env
   # Renseigner DATABASE_URL (PostgreSQL)
   npx prisma db push
   npm run db:seed
   ```
2. **Backend** : dans `backend/.env`, même `DATABASE_URL` et `API_KEY` (voir `backend/.env.example`).
3. **Dashboard** : dans `dashboard/.env`, `BACKEND_URL=http://localhost:3001` et `BACKEND_API_KEY` (même valeur que `API_KEY`).  
4. **Démarrer** : `npm run dev` (frontend + backend) ; dashboard avec `npm run dev:dashboard`.

## Fonctionnalités

- Hero, menu par catégories (Kaskrout, Fricassé, Entrées, Desserts, Boissons)
- Panier flottant, frais de livraison, codes promo (ex. BIENVENUE, TORKIA10, MIDI)
- Formule Midi mise en avant, badge « Best Seller », options (extra harissa, sans olives, etc.)
- Checkout : livraison / Click & Collect, paiement à la livraison ou carte (Stripe)
- Page de confirmation, section À propos, footer (adresse, horaires, Instagram)
- **Tableau de bord admin** (`/admin`) : connexion, liste des commandes, ajout de catégories et de produits (voir [docs/ADMIN.md](docs/ADMIN.md))
- SEO : meta tags, JSON-LD Restaurant

## Admin (frontend)

L’admin intégré au frontend est accessible à **[/admin](http://localhost:5173/admin)** (lien « Admin » dans le header).

- **Connexion** : mot de passe configurable via `VITE_ADMIN_PASSWORD` (défaut : `admin`). La session est stockée en `sessionStorage` (perdue à la fermeture de l’onglet).
- **Commandes** : affichage des commandes (nom, téléphone, date, total) avec bouton Actualiser.
- **Catégories** : formulaire pour ajouter une catégorie (nom, slug, ordre) et liste des catégories existantes.
- **Produits** : formulaire pour ajouter un produit (nom, description, prix, image URL, catégorie, best-seller, disponible) et liste des produits existants.

Variables d’environnement frontend (voir `frontend/.env.example`) :

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_BASE` | URL de base de l’API (backend) | `http://localhost:3001/api` |
| `VITE_ADMIN_PASSWORD` | Mot de passe de connexion admin | `admin` |

## Stripe

Pour activer le paiement par carte :

1. Créer un compte [Stripe](https://stripe.com) et récupérer les clés.
2. Dans le backend, décommenter et configurer la route `POST /api/create-payment-intent` dans `backend/server.js`, et définir `STRIPE_SECRET_KEY`.
3. Dans le frontend, brancher les composants Stripe (`@stripe/react-stripe-js`) sur la page checkout lorsque `paymentMethod === 'card'`.

## Codes promo (démo)

- `BIENVENUE` : −2€  
- `TORKIA10` : −2,50€  
- `MIDI` : −1,50€  

Ces codes sont définis dans `frontend/src/data/promo.ts` et peuvent être gérés côté backend plus tard.
