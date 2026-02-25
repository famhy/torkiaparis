import { Link } from 'react-router-dom'

/* Tunisian-inspired geometric corner ornament */
function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 40 L40 0 M0 30 L30 0 M0 20 L20 0 M10 40 L40 10 M20 40 L40 20"
        stroke="#8B7244"
        strokeWidth="0.8"
        opacity="0.35"
      />
      <circle cx="40" cy="40" r="3" fill="#8B7244" opacity="0.25" />
      <path
        d="M0 50 L50 0 M0 45 L45 0"
        stroke="#0E509D"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden tunisian-pattern">
      {/* Warm overlay for depth */}
      <div className="absolute inset-0 hero-warm-overlay" />

      {/* Corner ornaments - Tunisian geometric flair */}
      <div className="absolute top-8 left-4 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 opacity-80">
        <CornerOrnament />
      </div>
      <div className="absolute top-8 right-4 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 rotate-90 opacity-80">
        <CornerOrnament />
      </div>
      <div className="absolute bottom-8 left-4 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 -rotate-90 opacity-80">
        <CornerOrnament />
      </div>
      <div className="absolute bottom-8 right-4 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 rotate-180 opacity-80">
        <CornerOrnament />
      </div>

      {/* Side decorative stripes - Mediterranean feel */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 sm:w-2 h-48 sm:h-64 bg-gradient-to-b from-transparent via-[var(--color-secondary)]/30 to-transparent rounded-r-full hidden md:block" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 sm:w-2 h-48 sm:h-64 bg-gradient-to-b from-transparent via-[var(--color-secondary)]/30 to-transparent rounded-l-full hidden md:block" />

      {/* Top & bottom gold accent lines */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)]/50 to-transparent" />
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)]/40 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-12 text-center">
        {/* Small welcome line - gold, elegant */}
        <p className="font-[var(--font-heading)] text-sm sm:text-base tracking-[0.35em] uppercase text-[var(--color-secondary)] mb-4 animate-fade-in">
          Bienvenue chez
        </p>

        {/* Main headline with subtle shadow for depth */}
        <h1 className="font-[var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--color-primary)] leading-[1.15] mb-5 sm:mb-6 animate-fade-in drop-shadow-sm">
          Le goût authentique
          <br />
          <span className="text-[var(--color-secondary)]">de la Tunisie, à Paris</span>
        </h1>

        {/* Decorative divider - Tunisian motif */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8 animate-fade-in animation-delay-200">
          <span className="w-8 sm:w-12 h-px bg-[var(--color-secondary)]/50" />
          <span className="w-2 h-2 rotate-45 bg-[var(--color-secondary)]/60" />
          <span className="w-16 sm:w-24 h-px bg-[var(--color-secondary)]/50" />
          <span className="w-2 h-2 rotate-45 bg-[var(--color-secondary)]/60" />
          <span className="w-8 sm:w-12 h-px bg-[var(--color-secondary)]/50" />
        </div>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
          Kaskrout, Fricassé & spécialités maison
          <br className="hidden sm:block" />
          <span className="text-[var(--color-primary)]/90 font-medium">préparés avec passion.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-300">
          <Link
            to="/#menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium shadow-[var(--shadow-card)] hover:opacity-95 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Commander maintenant
          </Link>
          <a
            href="#galerie"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[var(--radius-card)] border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium hover:bg-[var(--color-secondary)]/10 transition-all duration-300"
          >
            Découvrir nos créations
          </a>
        </div>

        {/* Small trust line */}
        <p className="mt-8 text-xs sm:text-sm text-gray-500 tracking-wide">
          Pain maison · Ingrédients frais · 79 rue Blanche, 75009 Paris
        </p>
      </div>
    </section>
  )
}
