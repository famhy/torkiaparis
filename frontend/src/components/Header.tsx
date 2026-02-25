import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navLinks = [
  { href: '#galerie', label: 'Galerie' },
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'Notre histoire' },
  { href: '#footer', label: 'Contact' },
]

export default function Header() {
  const { itemCount, toggleCart } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-card)]/95 backdrop-blur-sm border-b border-[var(--color-primary)]/10 shadow-[var(--shadow-soft)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 min-h-[44px]">
        <Link to="/" className="flex items-center gap-2 group min-h-[44px] items-center flex-shrink-0" onClick={closeMobileMenu}>
          <span className="font-[var(--font-heading)] text-lg sm:text-2xl font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors">
            Torkia Paris
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4 md:gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium py-2"
            >
              {label}
            </a>
          ))}
          <Link to="/admin" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium py-2">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="sm:hidden p-3 rounded-[var(--radius-card)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleCart}
            className="relative p-3 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all shadow-[var(--shadow-soft)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Ouvrir le panier"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-[var(--color-secondary)] text-white text-xs font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden top-14"
            onClick={closeMobileMenu}
            aria-hidden
          />
          <nav
            className="fixed left-0 right-0 top-14 z-50 sm:hidden bg-[var(--color-bg-card)] border-b border-[var(--color-primary)]/10 shadow-lg py-4 px-4 animate-fade-in"
            aria-label="Menu principal"
          >
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={closeMobileMenu}
                    className="flex items-center py-3 px-4 rounded-[var(--radius-card)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/10 min-h-[48px]"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center py-3 px-4 rounded-[var(--radius-card)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/10 min-h-[48px]"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}
