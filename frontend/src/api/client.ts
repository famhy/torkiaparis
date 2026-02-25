const VITE_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

export async function fetchCategories(): Promise<{ id: string; name: string; slug: string; order: number }[]> {
  const res = await fetch(`${VITE_API_BASE}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${VITE_API_BASE}/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export interface ApiProduct {
  id: string
  name: string
  description: string | null
  price: number | string
  imageUrl: string | null
  categoryId: string
  category: { id: string; name: string; slug: string }
  isBestseller: boolean
  isAvailable: boolean
  options?: {
    id: string
    name: string
    required: boolean
    singleChoice: boolean
    values: { id: string; label: string; price: number | string }[]
  }[]
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  order: number
}
