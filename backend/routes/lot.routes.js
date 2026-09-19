import express from 'express'
import { protect, authorize } from '../middleware/auth.middleware.js'
import {
  createLotController,
  getLotsController,
  getMyLotsController,
  getLotByIdController,
  updateLotController,
  cancelLotController,
} from '../controllers/lot.controller.js'

const router = express.Router()

router.get('/', getLotsController)

router.get('/my', protect, authorize('farmer', 'fpo'), getMyLotsController)

router.get('/:id', getLotByIdController)

router.post(
  '/',
  protect,
  authorize('farmer', 'fpo'),
  createLotController
)

router.patch(
  '/:id',
  protect,
  authorize('farmer', 'fpo'),
  updateLotController
)

router.delete(
  '/:id',
  protect,
  authorize('farmer', 'fpo'),
  cancelLotController
)

export default router