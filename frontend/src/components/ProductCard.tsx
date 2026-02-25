import { useState } from 'react'
import type { MenuItem } from '../types'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  item: MenuItem
}

export default function ProductCard({ item }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [options, setOptions] = useState<Record<string, string>>({})
  const [showOptions, setShowOptions] = useState(false)
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem(item, quantity, item.options && Object.keys(options).length ? options : undefined)
    setQuantity(1)
    setOptions({})
    setShowOptions(false)
  }

  const optionPrice = item.options?.reduce((sum, opt) => {
    const choiceId = options[opt.id]
    const choice = opt.choices.find((c) => c.id === choiceId)
    return sum + (choice ? choice.price * quantity : 0)
  }, 0) ?? 0
  const totalPrice = (item.price + optionPrice / quantity) * quantity

  return (
    <article
      className={`rounded-[var(--radius-card)] bg-[var(--color-bg-card)] p-4 sm:p-5 shadow-[var(--shadow-soft)] border transition-all hover:shadow-[var(--shadow-card)] min-w-0 ${
        item.formuleMidi ? 'border-[var(--color-secondary)] border-2 ring-2 ring-[var(--color-secondary)]/20' : 'border-[var(--color-primary)]/10'
      }`}
    >
      {item.formuleMidi && (
        <div className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2">
          Formule Midi
        </div>
      )}
      {item.bestSeller && !item.formuleMidi && (
        <span className="inline-block text-xs font-semibold text-white bg-[var(--color-secondary)] px-2 py-0.5 rounded-full mb-2">
          Best Seller
        </span>
      )}
      <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-1">
        {item.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
      <p className="text-lg font-bold text-[var(--color-secondary)] mb-4">
        {(totalPrice / quantity).toFixed(2)}€
        {quantity > 1 && <span className="text-gray-500 font-normal"> × {quantity} = {totalPrice.toFixed(2)}€</span>}
      </p>

      {item.options && item.options.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium"
          >
            {showOptions ? 'Masquer les options' : 'Personnaliser (harissa, olives…)'}
          </button>
          {showOptions && (
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-[var(--color-secondary)]/30">
              {item.options.map((opt) => (
                <div key={opt.id}>
                  <span className="text-xs text-gray-500">{opt.label}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opt.choices.map((c) => (
                      <label key={c.id} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`opt-${item.id}-${opt.id}`}
                          checked={options[opt.id] === c.id}
                          onChange={() => setOptions((o) => ({ ...o, [opt.id]: c.id }))}
                          className="rounded border-[var(--color-secondary)]"
                        />
                        <span className="text-sm">{c.label}{c.price > 0 ? ` (+${c.price}€)` : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center rounded-[var(--radius-card)] border border-[var(--color-primary)]/20 overflow-hidden shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            aria-label="Diminuer"
          >
            −
          </button>
          <span className="w-10 text-center font-medium min-h-[44px] sm:min-h-0 flex items-center justify-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 w-full sm:w-auto min-w-0 sm:min-w-[140px] py-3 sm:py-2.5 px-4 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:opacity-95 transition-all min-h-[44px]"
        >
          Ajouter au panier
        </button>
      </div>
    </article>
  )
}
