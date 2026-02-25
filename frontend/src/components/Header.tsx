import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { itemCount, toggleCart } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-card)]/95 backdrop-blur-sm border-b border-[var(--color-primary)]/10 shadow-[var(--shadow-soft)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-[var(--font-heading)] text-xl sm:text-2xl font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors">
            Torkia Paris
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#galerie" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium">
            Galerie
          </a>
          <a href="#menu" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium">
            Menu
          </a>
          <a href="#about" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium">
            Notre histoire
          </a>
          <a href="#footer" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium">
            Contact
          </a>
          <Link to="/admin" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors font-medium">
            Admin
          </Link>
        </nav>
        <button
          type="button"
          onClick={toggleCart}
          className="relative p-2 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all shadow-[var(--shadow-soft)]"
          aria-label="Ouvrir le panier"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-[var(--color-secondary)] text-white text-xs font-bold">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
