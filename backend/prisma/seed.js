import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const kaskrout = await prisma.category.upsert({
    where: { slug: 'kaskrout' },
    update: {},
    create: { name: 'Kaskrout', slug: 'kaskrout', order: 0 },
  })
  const fricasse = await prisma.category.upsert({
    where: { slug: 'fricasse' },
    update: {},
    create: { name: 'Fricassé', slug: 'fricasse', order: 1 },
  })
  const entrees = await prisma.category.upsert({
    where: { slug: 'entrees' },
    update: {},
    create: { name: 'Entrées', slug: 'entrees', order: 2 },
  })
  const desserts = await prisma.category.upsert({
    where: { slug: 'desserts' },
    update: {},
    create: { name: 'Desserts', slug: 'desserts', order: 3 },
  })
  const boissons = await prisma.category.upsert({
    where: { slug: 'boissons' },
    update: {},
    create: { name: 'Boissons', slug: 'boissons', order: 4 },
  })

  const productCount = await prisma.product.count()
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Le Classique', description: 'Thon, œuf, olives, harissa, pommes de terre', price: 9.9, categoryId: kaskrout.id, isBestseller: true },
        { name: 'Fric Morning', description: 'Petit fricassé du matin', price: 4.9, categoryId: fricasse.id },
        { name: 'Citronnade Maison', description: 'Fraîche et maison', price: 4.9, categoryId: boissons.id },
      ],
    })
  }

  console.log('Seed done: categories and sample products created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
