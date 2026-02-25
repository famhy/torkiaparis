import { prisma } from '../lib/prisma.js'

export async function getAll() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { order: 'asc' } }, { name: 'asc' }],
  })
}

export async function getById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function create(data) {
  const {
    name,
    description,
    price,
    imageUrl,
    categoryId,
    isBestseller,
    isAvailable,
  } = data
  return prisma.product.create({
    data: {
      name: String(name).trim(),
      description: description != null ? String(description).trim() || null : null,
      price: Number(price),
      imageUrl: imageUrl != null ? String(imageUrl).trim() || null : null,
      categoryId: String(categoryId),
      isBestseller: Boolean(isBestseller),
      isAvailable: isAvailable !== false,
    },
    include: { category: true },
  })
}

export async function update(id, data) {
  const {
    name,
    description,
    price,
    imageUrl,
    categoryId,
    isBestseller,
    isAvailable,
  } = data
  return prisma.product.update({
    where: { id },
    data: {
      ...(name != null && { name: String(name).trim() }),
      ...(description !== undefined && { description: description ? String(description).trim() : null }),
      ...(price != null && { price: Number(price) }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl ? String(imageUrl).trim() : null }),
      ...(categoryId != null && { categoryId: String(categoryId) }),
      ...(isBestseller !== undefined && { isBestseller: Boolean(isBestseller) }),
      ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
    },
    include: { category: true },
  })
}

export async function remove(id) {
  return prisma.product.delete({ where: { id } })
}
