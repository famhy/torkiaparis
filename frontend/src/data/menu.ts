import type { MenuItem } from '../types'

const customOptions = [
  {
    id: 'extras',
    label: 'Options',
    choices: [
      { id: 'harissa', label: 'Extra harissa', price: 0.5 },
      { id: 'no_olives', label: 'Sans olives', price: 0 },
      { id: 'extra_egg', label: 'Œuf supplémentaire', price: 1 },
    ],
  },
]

export const categories: { id: string; label: string }[] = [
  { id: 'kaskrout', label: 'Kaskrout' },
  { id: 'fricasse', label: 'Fricassé' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'boissons', label: 'Boissons' },
]

export const menuItems: MenuItem[] = [
  // Kaskrout
  { id: 'k1', name: 'Le Classique', description: 'Thon, œuf, olives, harissa, pommes de terre', price: 9.9, category: 'kaskrout', bestSeller: true, options: customOptions },
  { id: 'k2', name: 'Le Veggie', description: 'Version végétarienne avec légumes de saison', price: 9.9, category: 'kaskrout', options: customOptions },
  { id: 'k3', name: 'Le Poulet', description: 'Poulet mariné, œuf, harissa, frites', price: 9.9, category: 'kaskrout', options: customOptions },
  { id: 'k4', name: 'Kaskrout de la Cheffe', description: 'Création du jour selon l\'inspiration', price: 11.9, category: 'kaskrout', bestSeller: true, options: customOptions },
  // Fricassé
  { id: 'f1', name: 'Fric Morning', description: 'Petit fricassé du matin', price: 4.9, category: 'fricasse' },
  { id: 'f2', name: 'Le Classique', description: 'Thon, œuf, pommes de terre, harissa', price: 6.9, category: 'fricasse', bestSeller: true },
  { id: 'f3', name: 'Fricassé de la Cheffe', description: 'Spécialité maison', price: 8.9, category: 'fricasse' },
  { id: 'f4', name: 'Le Veggie', description: 'Fricassé végétarien', price: 6.9, category: 'fricasse' },
  { id: 'f5', name: 'Le Poulet', description: 'Poulet et légumes', price: 6.9, category: 'fricasse' },
  // Entrées
  { id: 'e1', name: 'Assiette de Torkia', description: 'Dégustation de nos meilleures recettes', price: 13.9, category: 'entrees' },
  { id: 'e2', name: 'Mini Assiette', description: 'Petite assiette découverte', price: 7.9, category: 'entrees' },
  { id: 'e3', name: 'Brique au Thon', description: 'Feuille de brick, thon, œuf', price: 6.9, category: 'entrees' },
  { id: 'e4', name: "Brique à l'Oeuf", description: 'Brique traditionnelle à l\'œuf', price: 6.9, category: 'entrees' },
  // Desserts
  { id: 'd1', name: 'Fricassé Chocolat', description: 'Fricassé sucré au chocolat', price: 5.9, category: 'desserts' },
  { id: 'd2', name: 'Assortiment x3', description: '3 pièces au choix', price: 4.9, category: 'desserts' },
  { id: 'd3', name: 'Assortiment x15', description: '15 pièces pour partager', price: 22, category: 'desserts' },
  // Boissons
  { id: 'b1', name: 'Citronnade Maison', description: 'Fraîche et maison', price: 4.9, category: 'boissons' },
  { id: 'b2', name: 'Soda', description: 'Au choix', price: 2.9, category: 'boissons' },
  { id: 'b3', name: 'Eau', description: '33 cl', price: 2.9, category: 'boissons' },
  { id: 'b4', name: 'Thé', description: 'Thé à la menthe ou nature', price: 3.9, category: 'boissons' },
  { id: 'b5', name: 'Kawa Arbi', description: 'Café traditionnel tunisien', price: 4.9, category: 'boissons' },
]

// Formule Midi: special combo (highlighted in gold)
export const formuleMidiItem: MenuItem = {
  id: 'formule-midi',
  name: 'Formule Midi',
  description: 'Un fricassé ou kaskrout + boisson + dessert. Du lundi au vendredi.',
  price: 14.9,
  category: 'kaskrout',
  formuleMidi: true,
  options: customOptions,
}
