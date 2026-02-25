import { useState, useEffect } from 'react'
import { galleryItems, type GalleryItem } from '../data/gallery'

function GalleryCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full aspect-[4/3] sm:aspect-[3/2] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-soft)] border border-[var(--color-primary)]/10 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-secondary)]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-2"
    >
      <img
        src={item.src}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left bg-gradient-to-t from-black/80 to-transparent sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-[var(--font-heading)] text-base sm:text-lg font-semibold text-white drop-shadow-md">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-white/90 line-clamp-2 mt-0.5 hidden sm:block">{item.description}</p>
      </div>
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
        {item.featured && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)] bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm">
            Incontournable
          </span>
        )}
      </div>
    </button>
  )
}

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={item.title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors z-10"
        aria-label="Fermer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative max-w-4xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-auto max-h-[75vh] object-contain rounded-[var(--radius-card)] shadow-2xl"
        />
        <div className="mt-4 text-center">
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-white">{item.title}</h3>
          <p className="text-white/80 text-sm mt-1">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function ProductGallery() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)

  const featured = galleryItems.filter((i) => i.featured)
  const rest = galleryItems.filter((i) => !i.featured)

  return (
    <section id="galerie" className="py-16 sm:py-20 bg-[var(--color-bg-card)] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="gold-divider w-24 mx-auto mb-6" />
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-3">
            Nos créations
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Découvrez les plats qui font l'âme de Torkia Paris — authentiques, généreux et préparés avec amour.
          </p>
        </div>

        {/* Featured: 2 large + 1 medium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="md:col-span-2">
            <GalleryCard item={featured[0]} onClick={() => setLightboxItem(featured[0])} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
            <GalleryCard item={featured[1]} onClick={() => setLightboxItem(featured[1])} />
            <GalleryCard item={featured[2]} onClick={() => setLightboxItem(featured[2])} />
          </div>
        </div>

        {/* Rest: 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {rest.map((item) => (
            <GalleryCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Cliquez sur une image pour l'agrandir
        </p>
      </div>

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </section>
  )
}
