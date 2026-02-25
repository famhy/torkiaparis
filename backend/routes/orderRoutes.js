import { Router } from 'express'
import * as orderController from '../controllers/orderController.js'

const router = Router()

router.get('/', orderController.list)
router.post('/', orderController.create)
router.patch('/:id/status', orderController.updateStatus)
router.get('/:id', orderController.getOne)

export default router
