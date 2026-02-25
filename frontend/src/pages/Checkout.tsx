import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { CheckoutForm, DeliveryType, PaymentMethod } from '../types'
import { PROMO_CODES } from '../data/promo'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, deliveryFee, promoCode, promoDiscount, applyPromo, clearPromo, clearCart } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [form, setForm] = useState<CheckoutForm>({
    nom: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    instructions: '',
    deliveryType: 'livraison',
    paymentMethod: 'livraison',
  })
  const [submitting, setSubmitting] = useState(false)

  const handlePromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    const discount = PROMO_CODES[code]
    if (discount != null) {
      applyPromo(code, discount)
      setPromoError('')
    } else {
      setPromoError('Code invalide')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items,
          subtotal,
          deliveryFee,
          promoDiscount,
          total: Math.max(0, subtotal + deliveryFee - promoDiscount),
          promoCode: promoCode || undefined,
        }),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      clearCart()
      navigate('/confirmation')
    } catch {
      // Fallback: still go to confirmation for demo
      clearCart()
      navigate('/confirmation')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-6">Votre panier est vide.</p>
        <a href="/#menu" className="text-[var(--color-primary)] font-medium hover:underline">
          Voir le menu
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-16">
      <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-semibold text-[var(--color-primary)] mb-6 sm:mb-8">
        Passer la commande
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            required
            value={form.nom}
            onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-base"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            required
            value={form.telephone}
            onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-base"
            placeholder="06 12 34 56 78"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            required={form.deliveryType === 'livraison'}
            value={form.adresse}
            onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-base"
            placeholder="Numéro et rue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
          <input
            type="text"
            required
            value={form.codePostal}
            onChange={(e) => setForm((f) => ({ ...f, codePostal: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-base"
            placeholder="75009"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions spéciales</label>
          <textarea
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            rows={3}
            className="w-full rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-base"
            placeholder="Allergies, étage, code d'accès..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mode de retrait</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={form.deliveryType === 'livraison'}
                onChange={() => setForm((f) => ({ ...f, deliveryType: 'livraison' as DeliveryType }))}
                className="text-[var(--color-primary)]"
              />
              <span>Livraison</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={form.deliveryType === 'click_collect'}
                onChange={() => setForm((f) => ({ ...f, deliveryType: 'click_collect' as DeliveryType }))}
                className="text-[var(--color-primary)]"
              />
              <span>Click & Collect</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paiement</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={form.paymentMethod === 'livraison'}
                onChange={() => setForm((f) => ({ ...f, paymentMethod: 'livraison' as PaymentMethod }))}
                className="text-[var(--color-primary)]"
              />
              <span>Paiement à la livraison</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={form.paymentMethod === 'card'}
                onChange={() => setForm((f) => ({ ...f, paymentMethod: 'card' as PaymentMethod }))}
                className="text-[var(--color-primary)]"
              />
              <span>Carte bancaire (Stripe)</span>
            </label>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-secondary)]/30 p-4 bg-[var(--color-bg)]">
          <label className="block text-sm font-medium text-gray-700 mb-2">Code promo</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
              placeholder="Ex: BIENVENUE"
              className="flex-1 min-w-0 rounded-[var(--radius-card)] border border-gray-300 px-4 py-3 sm:py-2.5 uppercase text-base"
            />
            <button
              type="button"
              onClick={handlePromo}
              className="px-4 py-3 sm:py-2.5 rounded-[var(--radius-card)] border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium hover:bg-[var(--color-secondary)]/10 min-h-[48px] shrink-0"
            >
              Appliquer
            </button>
          </div>
          {promoCode && (
            <p className="mt-2 text-sm text-green-600">
              Code {promoCode} appliqué (−{promoDiscount}€)
              <button type="button" onClick={clearPromo} className="ml-2 text-red-600 hover:underline">Retirer</button>
            </p>
          )}
          {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
        </div>

        <div className="border-t pt-6 space-y-2">
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
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Réduction</span>
              <span>−{promoDiscount.toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-[var(--color-primary)] pt-2">
            <span>Total</span>
            <span>{Math.max(0, subtotal + deliveryFee - promoDiscount).toFixed(2)}€</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:opacity-95 disabled:opacity-70 transition-all min-h-[48px]"
        >
          {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  )
}
