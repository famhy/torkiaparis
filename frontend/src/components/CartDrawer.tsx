import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { CartItem } from '../types'

function getCartItemTotal(cartItem: CartItem): number {
  let sum = cartItem.item.price * cartItem.quantity
  if (cartItem.item.options && cartItem.options) {
    for (const opt of cartItem.item.options) {
      const choiceId = cartItem.options[opt.id]
      const choice = opt.choices.find((c) => c.id === choiceId)
      if (choice) sum += choice.price * cartItem.quantity
    }
  }
  return sum
}

export default function CartDrawer() {
  const { items, isCartOpen, toggleCart, updateQuantity, removeItem, subtotal, deliveryFee, total, promoCode, promoDiscount } = useCart()

  if (!isCartOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={toggleCart}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-bg-card)] shadow-2xl z-50 flex flex-col animate-slide-in-right"
        aria-modal
        aria-label="Panier"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-primary)]/10">
          <h2 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-primary)]">
            Votre panier
          </h2>
          <button
            type="button"
            onClick={toggleCart}
            className="p-2 rounded-[var(--radius-card)] hover:bg-gray-100 text-gray-600"
            aria-label="Fermer le panier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((cartItem) => {
                const optionsKey = cartItem.options ? JSON.stringify(cartItem.options) : ''
                return (
                  <li
                    key={`${cartItem.item.id}-${optionsKey}`}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-primary)]">{cartItem.item.name}</p>
                      <p className="text-sm text-[var(--color-secondary)] font-semibold">
                        {getCartItemTotal(cartItem).toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-[var(--radius-card)] border border-[var(--color-primary)]/20">
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1, optionsKey)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1, optionsKey)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(cartItem.item.id, optionsKey)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Retirer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--color-primary)]/10 space-y-2 bg-[var(--color-bg)]">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>{deliveryFee.toFixed(2)}€</span>
              </div>
            )}
            {promoCode && promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Réduction ({promoCode})</span>
                <span>−{promoDiscount.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[var(--color-primary)] pt-2">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <Link
              to="/checkout"
              onClick={toggleCart}
              className="block w-full py-3.5 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white text-center font-medium hover:opacity-95 transition-all mt-4"
            >
              Passer la commande
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
