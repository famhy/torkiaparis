const VITE_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

export interface AdminOrder {
  id: string
  nom: string
  telephone?: string
  adresse?: string
  total: number
  status?: string
  createdAt: string
  items?: { name: string; quantity: number; price: number }[]
}

export async function fetchOrders(): Promise<AdminOrder[]> {
  const res = await fetch(`${VITE_API_BASE}/orders`)
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export interface CreateCategoryBody {
  name: string
  slug: string
  order?: number
}

export async function createCategory(body: CreateCategoryBody): Promise<{ id: string; name: string; slug: string; order: number }> {
  const res = await fetch(`${VITE_API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur création catégorie')
  }
  return res.json()
}

export interface UpdateCategoryBody {
  name?: string
  slug?: string
  order?: number
}

export async function updateCategory(id: string, body: UpdateCategoryBody): Promise<{ id: string; name: string; slug: string; order: number }> {
  const res = await fetch(`${VITE_API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur mise à jour catégorie')
  }
  return res.json()
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${VITE_API_BASE}/categories/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur suppression catégorie')
  }
}

export interface CreateProductBody {
  name: string
  description?: string
  price: number
  imageUrl?: string
  categoryId: string
  isBestseller?: boolean
  isAvailable?: boolean
}

export async function createProduct(body: CreateProductBody): Promise<unknown> {
  const res = await fetch(`${VITE_API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur création produit')
  }
  return res.json()
}

export interface UpdateProductBody {
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  categoryId?: string
  isBestseller?: boolean
  isAvailable?: boolean
}

export async function updateProduct(id: string, body: UpdateProductBody): Promise<unknown> {
  const res = await fetch(`${VITE_API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur mise à jour produit')
  }
  return res.json()
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${VITE_API_BASE}/products/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Erreur suppression produit')
  }
}
