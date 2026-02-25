import { prisma } from '../lib/prisma.js'
import { safeParseJson } from '../utils/parseJson.js'

function mapOrder(o) {
  return {
    ...o,
    items: safeParseJson(o.items),
  }
}

export async function getAll() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return orders.map(mapOrder)
}

export async function getById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
  })
  return order ? mapOrder(order) : null
}

export async function create(data) {
  const {
    nom,
    telephone,
    adresse,
    codePostal,
    instructions,
    deliveryType,
    paymentMethod,
    items,
    subtotal,
    deliveryFee,
    promoDiscount,
    total,
    promoCode,
  } = data
  const order = await prisma.order.create({
    data: {
      nom: String(nom).trim(),
      telephone: telephone != null ? String(telephone).trim() : null,
      adresse: adresse != null ? String(adresse).trim() : null,
      codePostal: codePostal != null ? String(codePostal).trim() : null,
      instructions: instructions != null ? String(instructions).trim() : null,
      deliveryType: deliveryType != null ? String(deliveryType) : null,
      paymentMethod: paymentMethod != null ? String(paymentMethod) : null,
      items: typeof items === 'string' ? items : JSON.stringify(items ?? []),
      subtotal: Number(subtotal ?? 0),
      deliveryFee: Number(deliveryFee ?? 0),
      promoDiscount: Number(promoDiscount ?? 0),
      total: Number(total),
      promoCode: promoCode != null ? String(promoCode).trim() : null,
    },
  })
  return mapOrder(order)
}

export async function updateStatus(id, status) {
  return prisma.order.update({
    where: { id },
    data: { status: String(status) },
  })
}
