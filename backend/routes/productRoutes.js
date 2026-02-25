import { Router } from 'express'
import * as productController from '../controllers/productController.js'

const router = Router()

router.get('/', productController.list)
router.get('/:id', productController.getOne)
router.post('/', productController.create)
router.put('/:id', productController.update)
router.delete('/:id', productController.remove)

export default router
