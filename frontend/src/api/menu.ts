import type { ApiProduct } from './client'
import type { MenuItem, ProductOption } from '../types'

export function mapApiProductToMenuItem(p: ApiProduct): MenuItem {
  const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price
  const options: ProductOption[] | undefined = p.options?.length
    ? p.options.map((opt) => ({
        id: opt.id,
        label: opt.name,
        choices: opt.values.map((v) => ({
          id: v.id,
          label: v.label,
          price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
        })),
      }))
    : undefined
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    price,
    category: p.category.slug,
    bestSeller: p.isBestseller,
    options,
  }
}
