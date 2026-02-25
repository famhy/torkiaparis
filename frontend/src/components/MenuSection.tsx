import { useState } from 'react'
import { useMenu } from '../context/MenuContext'
import ProductCard from './ProductCard'
import type { CategoryId } from '../types'

export default function MenuSection() {
  const { categories, menuItems, formuleMidiItem, loading, error } = useMenu()
  const [activeCategory, setActiveCategory] = useState<CategoryId>(categories[0]?.id ?? 'kaskrout')

  const filteredItems = menuItems.filter((i) => i.category === activeCategory)

  if (loading) {
    return (
      <section id="menu" className="py-16 sm:py-20 bg-[var(--color-bg)] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-4">
            Notre menu
          </h2>
          <p className="text-gray-500">Chargement du menu...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="menu" className="py-16 sm:py-20 bg-[var(--color-bg)] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-4">
            Notre menu
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Vérifiez que le serveur est démarré (port 3001).</p>
        </div>
      </section>
    )
  }

  return (
    <section id="menu" className="py-16 sm:py-20 bg-[var(--color-bg)] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] text-center mb-4">
          Notre menu
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          Des recettes authentiques préparées avec des ingrédients frais et notre pain maison.
        </p>

        {formuleMidiItem && (
          <>
            <div className="mb-12">
              <ProductCard item={formuleMidiItem} />
            </div>
            <div className="gold-divider w-24 mx-auto mb-10" />
          </>
        )}

        {categories.length > 0 && (
          <>
            <div className="flex overflow-x-auto gap-2 pb-2 mb-10 -mx-1 px-1 scrollbar-thin snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 snap-start px-4 py-3 sm:px-5 sm:py-2.5 rounded-[var(--radius-card)] font-medium transition-all min-h-[44px] ${
                    activeCategory === cat.id
                      ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)]'
                      : 'bg-[var(--color-bg-card)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {categories.length === 0 && menuItems.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucun produit pour le moment.</p>
        )}
      </div>
    </section>
  )
}
