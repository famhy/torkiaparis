import * as categoryService from '../services/categoryService.js'

export async function list(req, res) {
  try {
    const categories = await categoryService.getAll()
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

export async function getOne(req, res) {
  try {
    const category = await categoryService.getById(req.params.id, true)
    if (!category) return res.status(404).json({ error: 'Category not found' })
    res.json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
}

export async function create(req, res) {
  try {
    const { name, slug, order } = req.body
    if (!name || !slug) {
      return res.status(400).json({ error: 'name and slug are required' })
    }
    const category = await categoryService.create({ name, slug, order })
    res.status(201).json(category)
  } catch (err) {
    console.error(err)
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    res.status(500).json({ error: 'Failed to create category' })
  }
}

export async function update(req, res) {
  try {
    const { name, slug, order } = req.body
    const category = await categoryService.update(req.params.id, { name, slug, order })
    res.json(category)
  } catch (err) {
    console.error(err)
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    res.status(500).json({ error: 'Failed to update category' })
  }
}

export async function remove(req, res) {
  try {
    await categoryService.remove(req.params.id)
    res.status(204).send()
  } catch (err) {
    console.error(err)
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' })
    res.status(500).json({ error: 'Failed to delete category' })
  }
}
