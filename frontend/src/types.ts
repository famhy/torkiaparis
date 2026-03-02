// CategoryId: slug from API (e.g. kaskrout, fricasse)
export type CategoryId = string

export interface ProductOption {
  id: string
  label: string
  choices: { id: string; label: string; price: number }[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: CategoryId
  imageUrl?: string | null
  bestSeller?: boolean
  formuleMidi?: boolean
  options?: ProductOption[]
}

export interface CartItem {
  item: MenuItem
  quantity: number
  options?: Record<string, string> // optionId -> choiceId
}

export type DeliveryType = 'livraison' | 'click_collect'
export type PaymentMethod = 'livraison' | 'card'

export interface CheckoutForm {
  nom: string
  telephone: string
  adresse: string
  codePostal: string
  instructions: string
  deliveryType: DeliveryType
  paymentMethod: PaymentMethod
}

export interface Order extends CheckoutForm {
  id: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  promoDiscount: number
  total: number
  promoCode?: string
  createdAt: string
}
