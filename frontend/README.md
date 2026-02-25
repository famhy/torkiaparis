# Torkia Paris – Frontend

Application React (Vite + TypeScript + Tailwind) : site vitrine, menu, panier, checkout et interface admin.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173). L’API backend doit être disponible (voir racine du repo).

## Variables d’environnement

Copier `.env.example` vers `.env` et adapter si besoin :

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | URL de base de l’API (ex. `http://localhost:3001/api`) |
| `VITE_ADMIN_PASSWORD` | Mot de passe de l’admin (`/admin`) |

Voir [../docs/ADMIN.md](../docs/ADMIN.md) pour la documentation de l’interface admin.
