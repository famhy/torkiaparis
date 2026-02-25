# Documentation Admin (frontend)

Documentation du tableau de bord admin intégré au frontend Torkia Paris.

## Accès

- **URL** : `/admin` (ex. [http://localhost:5173/admin](http://localhost:5173/admin))
- **Lien** : présent dans le header du site (« Admin »)

## Connexion

1. Aller sur `/admin`.
2. Saisir le **mot de passe admin**.
3. Cliquer sur « Se connecter ».

- **Mot de passe par défaut** : `admin`
- **Personnalisation** : définir `VITE_ADMIN_PASSWORD` dans `frontend/.env` (voir `frontend/.env.example`).
- **Session** : stockée en `sessionStorage` ; la déconnexion est automatique à la fermeture de l’onglet. Un bouton « Déconnexion » permet de se déconnecter manuellement.

## Onglets

### Commandes

- Liste des commandes : nom du client, téléphone, date/heure, montant total.
- **Actualiser** : recharge la liste depuis l’API.

Les données viennent de `GET {VITE_API_BASE}/orders`. Le backend doit exposer cet endpoint et retourner un tableau d’objets avec au moins : `id`, `nom`, `total`, `createdAt`, et optionnellement `telephone`, `adresse`, `status`, `items`.

### Catégories

- **Formulaire « Ajouter une catégorie »** :
  - **Nom** : libellé affiché (ex. « Kaskrout »).
  - **Slug** : identifiant URL (ex. `kaskrout`). Si vide, il est déduit du nom.
  - **Ordre** : numéro d’affichage (ex. 0, 1, 2).
- **Liste** : catégories existantes (nom, slug, ordre).

Création via `POST {VITE_API_BASE}/categories` avec body JSON : `{ name, slug, order? }`.

### Produits

- **Formulaire « Ajouter un produit »** :
  - **Nom** : nom du produit.
  - **Description** : optionnel.
  - **Prix (€)** : nombre décimal (ex. 9.90).
  - **Image (URL)** : optionnel.
  - **Catégorie** : choix dans la liste des catégories.
  - **Best-seller** : case à cocher.
  - **Disponible** : case à cocher (cochée par défaut).
- **Liste** : produits existants avec nom, catégorie et prix.

Création via `POST {VITE_API_BASE}/products` avec body JSON :  
`{ name, description?, price, imageUrl?, categoryId, isBestseller?, isAvailable? }`.

## Contrat API (backend)

Le backend (voir `backend/README.md`) expose les routes suivantes. Le frontend admin et le menu utilisent la même base d’API (`VITE_API_BASE` ou proxy `/api`).

### Catégories (CRUD)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/categories` | Liste. Réponse : `[{ id, name, slug, order }]`. |
| `GET` | `/api/categories/:id` | Détail + produits. |
| `POST` | `/api/categories` | Créer. Body : `{ name, slug, order? }`. |
| `PUT` | `/api/categories/:id` | Modifier. Body : `{ name?, slug?, order? }`. |
| `DELETE` | `/api/categories/:id` | Supprimer. |

### Produits (CRUD)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/products` | Liste avec `category`. |
| `GET` | `/api/products/:id` | Détail. |
| `POST` | `/api/products` | Créer. Body : `{ name, price, categoryId, description?, imageUrl?, isBestseller?, isAvailable? }`. |
| `PUT` | `/api/products/:id` | Modifier (champs optionnels). |
| `DELETE` | `/api/products/:id` | Supprimer. |

### Commandes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/orders` | Liste. Réponse : `[{ id, nom, telephone?, total, status?, createdAt, items? }]`. |
| `GET` | `/api/orders/:id` | Détail. |
| `POST` | `/api/orders` | Créer (checkout). |
| `PATCH` | `/api/orders/:id/status` | Body : `{ status }`. |

En production, il est recommandé de protéger les routes d’écriture par une authentification ou une clé API côté backend.

## Fichiers concernés

- `frontend/src/pages/Admin.tsx` : page admin (connexion + onglets).
- `frontend/src/context/AdminAuthContext.tsx` : état de connexion admin (session).
- `frontend/src/api/admin.ts` : appels API (orders, createCategory, createProduct).
- `frontend/src/api/client.ts` : types et fetch categories/products (partagés avec le menu).
