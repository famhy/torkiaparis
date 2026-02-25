import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { CartItem, MenuItem } from '../types'

const DELIVERY_FEE = 2.5

function getCartItemTotal(cartItem: CartItem): number {
  let sum = cartItem.item.price * cartItem.quantity
  if (cartItem.item.options && cartItem.options) {
    for (const opt of cartItem.item.options) {
      const choice = opt.choices.find((c) => c.id === cartItem.options![opt.id])
      if (choice) sum += choice.price * cartItem.quantity
    }
  }
  return sum
}
const MIN_ORDER_FOR_DELIVERY = 15

interface CartState {
  items: CartItem[]
  promoCode: string
  promoDiscount: number
  isCartOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; item: MenuItem; quantity: number; options?: Record<string, string> }
  | { type: 'REMOVE_ITEM'; itemId: string; optionsKey?: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number; optionsKey?: string }
  | { type: 'APPLY_PROMO'; code: string; discount: number }
  | { type: 'CLEAR_PROMO' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const optionsKey = action.options ? JSON.stringify(action.options) : ''
      const existing = state.items.find(
        (i) => i.item.id === action.item.id && (i.options ? JSON.stringify(i.options) : '') === optionsKey
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + action.quantity } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { item: action.item, quantity: action.quantity, options: action.options }],
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => {
          const key = i.options ? JSON.stringify(i.options) : ''
          return !(i.item.id === action.itemId && (action.optionsKey ?? '') === key)
        }),
      }
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => {
            const key = i.options ? JSON.stringify(i.options) : ''
            return !(i.item.id === action.itemId && (action.optionsKey ?? '') === key)
          }),
        }
      }
      return {
        ...state,
        items: state.items.map((i) => {
          const key = i.options ? JSON.stringify(i.options) : ''
          if (i.item.id === action.itemId && (action.optionsKey ?? '') === key) {
            return { ...i, quantity: action.quantity }
          }
          return i
        }),
      }
    }
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code, promoDiscount: action.discount }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: '', promoDiscount: 0 }
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen }
    case 'CLEAR_CART':
      return { ...state, items: [], promoCode: '', promoDiscount: 0 }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (item: MenuItem, quantity?: number, options?: Record<string, string>) => void
  removeItem: (itemId: string, optionsKey?: string) => void
  updateQuantity: (itemId: string, quantity: number, optionsKey?: string) => void
  applyPromo: (code: string, discount: number) => void
  clearPromo: () => void
  toggleCart: () => void
  clearCart: () => void
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    promoCode: '',
    promoDiscount: 0,
    isCartOpen: false,
  })

  const subtotal = state.items.reduce((sum, i) => sum + getCartItemTotal(i), 0)
  const needsDeliveryFee = subtotal > 0 && subtotal < MIN_ORDER_FOR_DELIVERY
  const deliveryFee = needsDeliveryFee ? DELIVERY_FEE : 0
  const total = Math.max(0, subtotal + deliveryFee - state.promoDiscount)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  const addItem = useCallback((item: MenuItem, quantity = 1, options?: Record<string, string>) => {
    dispatch({ type: 'ADD_ITEM', item, quantity, options })
  }, [])

  const removeItem = useCallback((itemId: string, optionsKey?: string) => {
    dispatch({ type: 'REMOVE_ITEM', itemId, optionsKey })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number, optionsKey?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity, optionsKey })
  }, [])

  const applyPromo = useCallback((code: string, discount: number) => {
    dispatch({ type: 'APPLY_PROMO', code, discount })
  }, [])

  const clearPromo = useCallback(() => dispatch({ type: 'CLEAR_PROMO' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        applyPromo,
        clearPromo,
        toggleCart,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
