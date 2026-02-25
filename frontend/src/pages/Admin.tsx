import { useState, useEffect, useCallback } from 'react'
import { fetchCategories, fetchProducts } from '../api/client'
import type { ApiCategory } from '../api/client'
import type { ApiProduct } from '../api/client'
import {
  fetchOrders,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  type AdminOrder,
  type CreateCategoryBody,
  type UpdateCategoryBody,
  type CreateProductBody,
} from '../api/admin'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useMenu } from '../context/MenuContext'

type Tab = 'orders' | 'categories' | 'products'

export default function Admin() {
  const { isAdmin, login, logout } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [])

  const loadCategories = useCallback(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  const loadProducts = useCallback(() => {
    fetchProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
  }, [])

  const { refetch: refetchMenu } = useMenu()
  const refreshCategoriesAndMenu = useCallback(() => {
    loadCategories()
    refetchMenu()
  }, [loadCategories, refetchMenu])

  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    setError(null)
    Promise.all([fetchOrders(), fetchCategories(), fetchProducts()])
      .then(([o, c, p]) => {
        setOrders(Array.isArray(o) ? o : [])
        setCategories(Array.isArray(c) ? c : [])
        setProducts(Array.isArray(p) ? p : [])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur chargement'))
      .finally(() => setLoading(false))
  }, [isAdmin])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (login(password)) return
    setLoginError('Mot de passe incorrect')
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-card)] p-8">
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-primary)] mb-2">
            Connexion admin
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Entrez le mot de passe pour accéder au tableau de bord.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              autoFocus
            />
            {loginError && (
              <p className="text-red-600 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'orders', label: 'Commandes' },
    { id: 'categories', label: 'Catégories' },
    { id: 'products', label: 'Produits' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-primary)]">
          Tableau de bord
        </h1>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Déconnexion
        </button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-[var(--radius-card)] font-medium transition-colors ${
              activeTab === id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</p>
      )}

      {activeTab === 'orders' && (
        <OrdersTab
          orders={orders}
          loading={loading}
          onRefresh={loadOrders}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          categories={categories}
          loading={loading}
          onRefresh={refreshCategoriesAndMenu}
        />
      )}

      {activeTab === 'products' && (
        <ProductsTab
          products={products}
          categories={categories}
          loading={loading}
          onRefresh={loadProducts}
        />
      )}
    </div>
  )
}

function OrdersTab({
  orders,
  loading,
  onRefresh,
}: {
  orders: AdminOrder[]
  loading: boolean
  onRefresh: () => void
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)]">
          Commandes
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Actualiser
        </button>
      </div>
      {loading ? (
        <p className="p-6 text-gray-500">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="p-6 text-gray-500">Aucune commande pour le moment.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {orders.map((o) => (
            <li key={o.id} className="p-4 flex justify-between items-start gap-4">
              <div>
                <p className="font-medium text-[var(--color-primary)]">{o.nom}</p>
                {o.telephone && (
                  <p className="text-sm text-gray-500">{o.telephone}</p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <span className="font-semibold text-[var(--color-secondary)] shrink-0">
                {Number(o.total).toFixed(2)}€
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CategoriesTab({
  categories,
  loading,
  onRefresh,
}: {
  categories: ApiCategory[]
  loading: boolean
  onRefresh: () => void
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [order, setOrder] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editing, setEditing] = useState<ApiCategory | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editOrder, setEditOrder] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: CreateCategoryBody = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      order,
    }
    setSubmitting(true)
    setMessage(null)
    try {
      await createCategory(body)
      setMessage({ type: 'ok', text: 'Catégorie ajoutée.' })
      setName('')
      setSlug('')
      setOrder(categories.length)
      onRefresh()
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (c: ApiCategory) => {
    setEditing(c)
    setEditName(c.name)
    setEditSlug(c.slug)
    setEditOrder(c.order)
    setMessage(null)
  }

  const cancelEdit = () => {
    setEditing(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSubmitting(true)
    setMessage(null)
    try {
      const body: UpdateCategoryBody = {
        name: editName.trim(),
        slug: editSlug.trim() || editName.trim().toLowerCase().replace(/\s+/g, '-'),
        order: editOrder,
      }
      await updateCategory(editing.id, body)
      setMessage({ type: 'ok', text: 'Catégorie mise à jour.' })
      setEditing(null)
      onRefresh()
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (c: ApiCategory) => {
    if (!window.confirm(`Supprimer la catégorie « ${c.name } » ? Les produits de cette catégorie seront aussi supprimés.`)) return
    setDeletingId(c.id)
    setMessage(null)
    try {
      await deleteCategory(c.id)
      setMessage({ type: 'ok', text: 'Catégorie supprimée.' })
      onRefresh()
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] p-6">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-4">
          Ajouter une catégorie
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
              }}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: Kaskrout"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: kaskrout"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              min={0}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {message && !editing && (
            <p className={message.type === 'ok' ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
          >
            {submitting ? 'Envoi...' : 'Ajouter la catégorie'}
          </button>
        </form>
      </div>

      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] overflow-hidden">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] p-4 border-b border-gray-100">
          Catégories existantes (synchro avec le menu)
        </h2>
        {message && editing && (
          <p className={`px-4 py-2 text-sm border-b border-gray-100 ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
        {loading ? (
          <p className="p-6 text-gray-500">Chargement...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-gray-500">Aucune catégorie.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((c) => (
              <li key={c.id} className="p-4">
                {editing?.id === c.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5">Nom</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5">Slug</label>
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="w-32 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5">Ordre</label>
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(parseInt(e.target.value, 10) || 0)}
                        min={0}
                        className="w-16 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 text-sm"
                    >
                      Annuler
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{c.slug} (ordre: {c.order})</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="px-2 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                        className="px-2 py-1 rounded border border-red-200 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === c.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ProductsTab({
  products,
  categories,
  loading,
  onRefresh,
}: {
  products: ApiProduct[]
  categories: ApiCategory[]
  loading: boolean
  onRefresh: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isBestseller, setIsBestseller] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id)
  }, [categories, categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numPrice = parseFloat(price.replace(',', '.'))
    if (Number.isNaN(numPrice) || numPrice < 0) {
      setMessage({ type: 'err', text: 'Prix invalide' })
      return
    }
    const body: CreateProductBody = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: numPrice,
      imageUrl: imageUrl.trim() || undefined,
      categoryId: categoryId || categories[0]?.id,
      isBestseller,
      isAvailable,
    }
    setSubmitting(true)
    setMessage(null)
    try {
      await createProduct(body)
      setMessage({ type: 'ok', text: 'Produit ajouté.' })
      setName('')
      setDescription('')
      setPrice('')
      setImageUrl('')
      setIsBestseller(false)
      setIsAvailable(true)
      onRefresh()
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erreur',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] p-6">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-4">
          Ajouter un produit
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="ex: Le Classique"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
            <input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="9.90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Optionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
              />
              <span className="text-sm">Best-seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <span className="text-sm">Disponible</span>
            </label>
          </div>
          {message && (
            <p className={message.type === 'ok' ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
          >
            {submitting ? 'Envoi...' : 'Ajouter le produit'}
          </button>
        </form>
      </div>

      <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-card)] shadow-[var(--shadow-soft)] overflow-hidden">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] p-4 border-b border-gray-100">
          Produits existants
        </h2>
        {loading ? (
          <p className="p-6 text-gray-500">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">Aucun produit.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {products.map((p) => (
              <li key={p.id} className="p-4 flex justify-between items-center gap-4">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({p.category?.name ?? p.categoryId})
                  </span>
                </div>
                <span className="text-[var(--color-secondary)] font-medium">
                  {typeof p.price === 'string' ? p.price : p.price.toFixed(2)}€
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
