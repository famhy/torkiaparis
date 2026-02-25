import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'

export function registerRoutes(app) {
  app.use('/api/categories', categoryRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/orders', orderRoutes)
}
