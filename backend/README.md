# Torkia Paris – Backend API

API REST Express + Prisma pour le menu, les commandes et l’admin. Organisation en **MVC**.

## Architecture (MVC)

| Couche | Dossier | Rôle |
|--------|---------|------|
| **Model** | `prisma/schema.prisma` + `services/` | Schéma des données (Prisma) et logique d’accès (services qui utilisent le client Prisma). |
| **View** | — | Pas de vue : l’API renvoie du JSON (les contrôleurs formatent la réponse). |
| **Controller** | `controllers/` | Gère la requête HTTP : validation des entrées, appel au service, envoi de la réponse ou des erreurs. |
| **Routes** | `routes/` | Définition des verbes et chemins, délégation aux contrôleurs. |

Fichiers principaux :

- `app.js` – Création de l’app Express, middleware, enregistrement des routes.
- `server.js` – Point d’entrée : charge la config et lance le serveur.
- `lib/prisma.js` – Client Prisma partagé.
- `utils/` – Helpers (ex. `parseJson`).

## Démarrage

```bash
npm install
cp .env.example .env
# Optionnel : éditer .env (DATABASE_URL, PORT)
npx prisma db push
npm run db:seed
npm run dev
```

L’API écoute sur **http://localhost:3001**. Le frontend (Vite) proxy ` /api` vers ce serveur.

## Variables d’environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma : SQLite `file:./dev.db` (défaut) ou PostgreSQL |
| `PORT` | Port du serveur (défaut : 3001) |

## Endpoints

### Catégories (CRUD)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/categories` | Liste (tri par `order`) |
| `GET` | `/api/categories/:id` | Détail + produits |
| `POST` | `/api/categories` | Créer (body : `name`, `slug`, `order?`) |
| `PUT` | `/api/categories/:id` | Modifier (body : `name?`, `slug?`, `order?`) |
| `DELETE` | `/api/categories/:id` | Supprimer (cascade produits) |

### Produits (CRUD)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/products` | Liste avec `category` |
| `GET` | `/api/products/:id` | Détail |
| `POST` | `/api/products` | Créer (body : `name`, `price`, `categoryId`, `description?`, `imageUrl?`, `isBestseller?`, `isAvailable?`) |
| `PUT` | `/api/products/:id` | Modifier (champs optionnels) |
| `DELETE` | `/api/products/:id` | Supprimer |

### Commandes

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/orders` | Liste (ordre décroissant par date) |
| `GET` | `/api/orders/:id` | Détail |
| `POST` | `/api/orders` | Créer (body : `nom`, `total`, `items`, `telephone?`, `adresse?`, etc.) |
| `PATCH` | `/api/orders/:id/status` | Mettre à jour le statut (body : `status`) |

## Base de données

- **SQLite** (défaut) : fichier `prisma/dev.db`, pas d’install externe.
- **PostgreSQL** : définir `DATABASE_URL` dans `.env` et adapter `provider` dans `prisma/schema.prisma` si besoin.
