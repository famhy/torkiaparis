import * as orderService from '../services/orderService.js'

export async function list(req, res) {
  try {
    const orders = await orderService.getAll()
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

export async function getOne(req, res) {
  try {
    const order = await orderService.getById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

export async function create(req, res) {
  try {
    const { nom, total } = req.body
    if (!nom || total == null) {
      return res.status(400).json({ error: 'nom and total are required' })
    }
    const order = await orderService.create(req.body)
    res.status(201).json({
      id: order.id,
      nom: order.nom,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'status is required' })
    const order = await orderService.updateStatus(req.params.id, status)
    res.json({ id: order.id, status: order.status })
  } catch (err) {
    console.error(err)
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' })
    res.status(500).json({ error: 'Failed to update order status' })
  }
}
