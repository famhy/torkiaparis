export interface GalleryItem {
  id: string
  src: string
  title: string
  description: string
  featured?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'lablebi',
    src: '/images/gallery/lablebi.png',
    title: "L'incontournable Lablebi de Torkia",
    description: "Soupe de pois chiches comme à Tunis, préparée à base de pois chiches, d'ail, cumin, d'harissa maison, pain perdu, l'œuf secret de Torkia et sa sauce magique.",
    featured: true,
  },
  {
    id: 'kemia',
    src: '/images/gallery/kemia.png',
    title: 'Mix de Kemia à partager',
    description: 'Servi avec tabouna chaude et harissa maison.',
    featured: true,
  },
  {
    id: 'fricasse',
    src: '/images/gallery/fricasse.png',
    title: 'Fricassé classique',
    description: 'Thon, œuf, pommes de terre, harissa — notre sandwich signature.',
    featured: false,
  },
  {
    id: 'sandwich',
    src: '/images/gallery/sandwich-close.png',
    title: 'Kaskrout & Fricassé',
    description: 'Pain maison frit, garni de thon, œuf, harissa et olives.',
    featured: false,
  },
  {
    id: 'table',
    src: '/images/gallery/table-spread.png',
    title: 'À la table de Torkia',
    description: 'Spécialités, tabouna, thé à la menthe et douceurs.',
    featured: true,
  },
  {
    id: 'bowl',
    src: '/images/gallery/bowl-kaskrout.png',
    title: 'Kaskrout à emporter',
    description: 'Nos sandwiches maison, préparés avec passion.',
    featured: false,
  },
  {
    id: 'paper',
    src: '/images/gallery/kaskrout-paper.png',
    title: 'Fricassé du jour',
    description: 'Fraîcheur et générosité dans chaque bouchée.',
    featured: false,
  },
]
