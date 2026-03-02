import { Link } from 'react-router-dom'
import { galleryItems } from '../data/gallery'

/* Hero uses first 3 gallery images for the right column */
const heroImages = galleryItems.slice(0, 3)

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-[85vh] overflow-hidden tunisian-pattern">
      <div className="absolute inset-0 hero-warm-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center min-h-[70vh] lg:min-h-0">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <p className="font-[var(--font-heading)] text-sm sm:text-base tracking-[0.35em] uppercase text-[var(--color-secondary)] mb-4 animate-fade-in">
              Bienvenue chez
            </p>

            <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold text-[var(--color-primary)] leading-[1.15] mb-5 sm:mb-6 animate-fade-in drop-shadow-sm">
            Le premier
Bar 

              <br />
              <span className="text-[var(--color-secondary)]">à Fricassé
              de Paris</span>
            </h1>

            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-8 animate-fade-in animation-delay-200">
              <span className="w-8 sm:w-12 h-px bg-[var(--color-secondary)]/50" />
              <span className="w-2 h-2 rotate-45 bg-[var(--color-secondary)]/60" />
              <span className="w-16 sm:w-24 h-px bg-[var(--color-secondary)]/50" />
              <span className="w-2 h-2 rotate-45 bg-[var(--color-secondary)]/60" />
              <span className="w-8 sm:w-12 h-px bg-[var(--color-secondary)]/50" />
            </div>

            <p className="text-md sm:text-md text-gray-600 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in animation-delay-200">
            Spécialités tunisiennes authentiques préparées avec amour. Fricassés, Kaskrout, Lablebi... l'âme de la Tunisie au cœur du 9e.
              <br className="hidden sm:block" />
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto lg:mx-0 animate-fade-in animation-delay-300">
              <Link
                to="/#menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium shadow-[var(--shadow-card)] hover:opacity-95 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] min-h-[48px]"
              >
                Commander maintenant
              </Link>
              <a
                href="#galerie"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-[var(--radius-card)] border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium hover:bg-[var(--color-secondary)]/10 transition-all duration-300 min-h-[48px]"
              >
                Découvrir nos créations
              </a>
            </div>

            <p className="mt-8 text-xs sm:text-sm text-gray-500 tracking-wide">
              Pain maison · Ingrédients frais · 79 rue Blanche, 75009 Paris
            </p>
          </div>

          {/* Right: image collage */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 grid-rows-[auto_auto_auto] lg:grid-rows-[1fr_1fr] lg:h-[min(28rem,50vh)] xl:h-[32rem]">
              {heroImages[0] && (
                <div className="col-span-2 lg:col-span-1 lg:row-span-2 flex">
                  <img
                    src={heroImages[0].src}
                    alt={heroImages[0].title}
                    className="w-full h-full min-h-[180px] sm:min-h-[220px] lg:min-h-0 object-cover rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border-2 border-white/80"
                  />
                </div>
              )}
              {heroImages[1] && (
                <div className="flex">
                  <img
                    src={heroImages[1].src}
                    alt={heroImages[1].title}
                    className="w-full h-full min-h-[140px] sm:min-h-[160px] lg:min-h-0 object-cover rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border-2 border-white/80"
                  />
                </div>
              )}
              {heroImages[2] && (
                <div className="flex">
                  <img
                    src={heroImages[2].src}
                    alt={heroImages[2].title}
                    className="w-full h-full min-h-[140px] sm:min-h-[160px] lg:min-h-0 object-cover rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border-2 border-white/80"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
