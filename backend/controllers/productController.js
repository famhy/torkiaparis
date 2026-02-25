import * as productService from '../services/productService.js'

export async function list(req, res) {
  try {
    const products = await productService.getAll()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export async function getOne(req, res) {
  try {
    const product = await productService.getById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

export async function create(req, res) {
  try {
    const { name, description, price, imageUrl, categoryId, isBestseller, isAvailable } = req.body
    if (!name || price == null || !categoryId) {
      return res.status(400).json({ error: 'name, price and categoryId are required' })
    }
    const product = await productService.create({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      isBestseller,
      isAvailable,
    })
    res.status(201).json(product)
  } catch (err) {
    console.error(err)
    if (err.code === 'P2003') return res.status(400).json({ error: 'Category not found' })
    res.status(500).json({ error: 'Failed to create product' })
  }
}

export async function update(req, res) {
  try {
    const { name, description, price, imageUrl, categoryId, isBestseller, isAvailable } = req.body
    const product = await productService.update(req.params.id, {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      isBestseller,
      isAvailable,
    })
    res.json(product)
  } catch (err) {
    console.error(err)
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' })
    if (err.code === 'P2003') return res.status(400).json({ error: 'Category not found' })
    res.status(500).json({ error: 'Failed to update product' })
  }
}

export async function remove(req, res) {
  try {
    await productService.remove(req.params.id)
    res.status(204).send()
  } catch (err) {
    console.error(err)
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' })
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
