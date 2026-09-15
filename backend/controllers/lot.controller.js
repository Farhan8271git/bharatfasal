import {
  createLot,
  getLots,
  getMyLots,
  getLotById,
  updateLot,
  cancelLot,
} from '../services/lot.service.js'

const handleError = (res, error) => {
  const statusCode = error.statusCode || 500

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Internal server error.'
        : error.message,
  })
}

export const createLotController = async (req, res) => {
  try {
    const lot = await createLot({
      sellerId: req.user.userId,
      sellerRole: req.user.role,
      data: req.body,
    })

    return res.status(201).json({
      success: true,
      message: 'Lot created successfully.',
      lot,
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getLotsController = async (req, res) => {
  try {
    const result = await getLots({
      commodity: req.query.commodity,
      status: req.query.status || 'listed',
      page: req.query.page,
      limit: req.query.limit,
    })

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getMyLotsController = async (req, res) => {
  try {
    const result = await getMyLots({
      sellerId: req.user.userId,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    })

    return res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getLotByIdController = async (req, res) => {
  try {
    const lot = await getLotById(req.params.id)

    return res.status(200).json({
      success: true,
      lot,
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const updateLotController = async (req, res) => {
  try {
    const lot = await updateLot({
      lotId: req.params.id,
      sellerId: req.user.userId,
      sellerRole: req.user.role,
      data: req.body,
    })

    return res.status(200).json({
      success: true,
      message: 'Lot updated successfully.',
      lot,
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const cancelLotController = async (req, res) => {
  try {
    const lot = await cancelLot({
      lotId: req.params.id,
      sellerId: req.user.userId,
      sellerRole: req.user.role,
    })

    return res.status(200).json({
      success: true,
      message: 'Lot cancelled successfully.',
      lot,
    })
  } catch (error) {
    return handleError(res, error)
  }
}