export default function Footer() {
  return (
    <footer id="footer" className="bg-[var(--color-primary)] text-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-[var(--font-heading)] text-xl font-semibold mb-4 text-[var(--color-secondary)]">
              Torkia Paris
            </h3>
            <p className="text-white/90 text-sm">
              Le goût authentique de la Tunisie, à Paris.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--color-secondary)]">Adresse</h4>
            <p className="text-white/90 text-sm">
              79 rue Blanche<br />
              75009 Paris
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--color-secondary)]">Horaires</h4>
            <p className="text-white/90 text-sm whitespace-pre-line">
              Lundi – Vendredi : 11h – 15h, 18h – 22h{'\n'}
              Samedi : 11h – 22h{'\n'}
              Dimanche : sur réservation
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--color-secondary)]">Contact</h4>
            <a href="tel:+33123456789" className="text-white/90 hover:text-[var(--color-secondary)] transition-colors block text-sm">
              +33 1 23 45 67 89
            </a>
            <a
              href="https://instagram.com/torkiaparis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-[var(--color-secondary)] transition-colors inline-flex items-center gap-2 mt-2 text-sm"
            >
              @torkiaparis
            </a>
          </div>
        </div>
        <div className="gold-divider mt-10 mb-10 opacity-60" />
        <p className="text-center text-white/80 text-sm">
          © {new Date().getFullYear()} Torkia Paris. Tous droits réservés.
          {' · '}
          <a href="/admin" className="text-white/60 hover:text-[var(--color-secondary)] transition-colors">Admin</a>
        </p>
      </div>
    </footer>
  )
}
