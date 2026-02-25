export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-[var(--color-bg-card)] scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl font-semibold text-[var(--color-primary)] mb-6">
          Notre histoire
        </h2>
        <div className="gold-divider w-24 mx-auto mb-8" />
        <p className="text-lg text-gray-700 leading-relaxed">
          Chez Torkia Paris, nous revisitons les classiques tunisiens avec des ingrédients frais et un pain maison.
          Chaque recette est préparée avec amour et savoir-faire.
        </p>
        <p className="mt-4 text-gray-600">
          Authenticité, qualité et générosité : c'est la promesse de chaque assiette que nous vous servons.
        </p>
      </div>
    </section>
  )
}
