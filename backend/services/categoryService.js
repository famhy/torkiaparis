import { prisma } from '../lib/prisma.js'

function normalizeSlug(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, '-')
}

export async function getAll() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
  })
}

export async function getById(id, includeProducts = false) {
  return prisma.category.findUnique({
    where: { id },
    ...(includeProducts && { include: { products: true } }),
  })
}

export async function create(data) {
  const { name, slug, order } = data
  return prisma.category.create({
    data: {
      name: String(name).trim(),
      slug: normalizeSlug(slug),
      order: order != null ? Number(order) : 0,
    },
  })
}

export async function update(id, data) {
  const { name, slug, order } = data
  return prisma.category.update({
    where: { id },
    data: {
      ...(name != null && { name: String(name).trim() }),
      ...(slug != null && { slug: normalizeSlug(slug) }),
      ...(order != null && { order: Number(order) }),
    },
  })
}

export async function remove(id) {
  return prisma.category.delete({ where: { id } })
}
