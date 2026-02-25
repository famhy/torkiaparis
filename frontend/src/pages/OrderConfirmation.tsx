import { Link } from 'react-router-dom'

export default function OrderConfirmation() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❤️</div>
        <h1 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-4">
          Merci pour votre commande
        </h1>
        <p className="text-gray-600 mb-8">
          Nous avons bien reçu votre commande. Vous serez contacté pour confirmer l'heure de livraison ou de retrait.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white font-medium hover:opacity-95 transition-all min-h-[48px]"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
