import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MENU_DATA = [
  {
    categorie: "Entrées",
    produits: [
      { nom: "L'Assiette de Torkia", prix: 13.9 },
      { nom: "La Mini Assiette de Torkia", prix: 7.9 },
      { nom: "Brique au Thon", prix: 6.9 },
      { nom: "Brique à l'Oeuf", prix: 6.9 },
      { nom: "Mix d'Entrées à Partager", prix: 19.9 },
    ],
  },
  {
    categorie: "Le Fricassé",
    produits: [
      { nom: "Fric Morning", prix: 4.9 },
      { nom: "Le Classique", prix: 6.9 },
      { nom: "Fricassé de la Cheffe", prix: 8.9 },
      { nom: "Le Veggie", prix: 6.9 },
      { nom: "Le Poulet", prix: 6.9 },
      { nom: "Fricassé Lablebi", prix: 6.9 },
      { nom: "Les Mini Fricassés", prix: 2.5 },
      { nom: "L'Incontournable Lablebi de Torkia", prix: 13.9 },
    ],
  },
  {
    categorie: "Le Kaskrout",
    produits: [
      { nom: "Le Classique", prix: 9.9 },
      { nom: "Le Veggie", prix: 9.9 },
      { nom: "Le Poulet", prix: 9.9 },
      { nom: "Le Kaskrout de la Cheffe", prix: 11.9 },
    ],
  },
  {
    categorie: "Boissons Froides",
    produits: [
      { nom: "Citronnade Maison", prix: 4.9 },
      { nom: "Soda", prix: 2.9 },
      { nom: "Eaux", prix: 2.9 },
    ],
  },
  {
    categorie: "Boissons Chaudes",
    produits: [
      { nom: "Thé", prix: 3.9 },
      { nom: "Latte Kawa Arbi", prix: 4.9 },
      { nom: "Kawa Arbi", prix: 4.9 },
    ],
  },
  {
    categorie: "Desserts",
    produits: [
      { nom: "Fricassé Chocolat", prix: 3.9 },
      { nom: "Assortiment de Pâtisseries Tunisiennes x3", prix: 4.9 },
      { nom: "Assortiment de Pâtisseries Tunisiennes x15", prix: 22.0 },
    ],
  },
  {
    categorie: "Formule du Midi",
    produits: [
      { nom: "Formule Fricassé", prix: 14.9 },
      { nom: "Formule Kaskrout", prix: 15.9 },
    ],
  },
]

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  // Delete existing products first (FK constraint)
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  for (let order = 0; order < MENU_DATA.length; order++) {
    const { categorie, produits } = MENU_DATA[order]
    const slug = slugify(categorie)

    const category = await prisma.category.create({
      data: {
        name: categorie,
        slug,
        order,
      },
    })

    await prisma.product.createMany({
      data: produits.map((p) => ({
        name: p.nom,
        price: p.prix,
        categoryId: category.id,
        description: null,
      })),
    })
  }

  const categoryCount = await prisma.category.count()
  const productCount = await prisma.product.count()
  console.log(`Seed done: ${categoryCount} categories and ${productCount} products created.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
