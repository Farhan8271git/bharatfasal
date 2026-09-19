import mongoose from 'mongoose'
import Lot from '../models/lot.model.js'

const SELLER_ROLES = ['farmer', 'fpo']

const normalizeString = (value) => {
  return typeof value === 'string' ? value.trim() : ''
}

const validateSellerId = (sellerId) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    const error = new Error('Invalid seller identity.')
    error.statusCode = 400
    throw error
  }
}

const validateLotData = (data) => {
  const commodity = normalizeString(data.commodity)
  const grade = normalizeString(data.grade)
  const pickupLocation = normalizeString(data.pickupLocation)
  const quantity = Number(data.quantity)
  const expectedPrice = Number(data.expectedPrice)
  const availableDate = new Date(data.availableDate)

  if (!commodity || commodity.length < 2) {
    const error = new Error('Commodity is required.')
    error.statusCode = 400
    throw error
  }

  if (!grade) {
    const error = new Error('Grade is required.')
    error.statusCode = 400
    throw error
  }

  if (!pickupLocation) {
    const error = new Error('Pickup location is required.')
    error.statusCode = 400
    throw error
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error('Quantity must be greater than zero.')
    error.statusCode = 400
    throw error
  }

  if (!Number.isFinite(expectedPrice) || expectedPrice < 0) {
    const error = new Error('Expected price must be a valid amount.')
    error.statusCode = 400
    throw error
  }

  if (Number.isNaN(availableDate.getTime())) {
    const error = new Error('Available date is invalid.')
    error.statusCode = 400
    throw error
  }

  return {
    commodity,
    quantity,
    unit: data.unit || 'quintal',
    grade,
    expectedPrice,
    pickupLocation,
    availableDate,
    transportation: data.transportation || 'buyer',
    status: data.status || 'listed',
    images: Array.isArray(data.images) ? data.images : [],
  }
}

export const createLot = async ({ sellerId, sellerRole, data }) => {
  validateSellerId(sellerId)

  if (!SELLER_ROLES.includes(sellerRole)) {
    const error = new Error(
      'Only farmers and FPOs can create crop lots.'
    )
    error.statusCode = 403
    throw error
  }

  const lotData = validateLotData(data)

  const lot = await Lot.create({
    sellerId,
    ...lotData,
  })

  return lot
}

export const getLots = async ({
  commodity,
  status = 'listed',
  page = 1,
  limit = 20,
}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  )

  const filter = {}

  if (status) {
    filter.status = normalizeString(status)
  }

  if (commodity) {
    filter.commodity = {
      $regex: normalizeString(commodity),
      $options: 'i',
    }
  }

  const skip = (normalizedPage - 1) * normalizedLimit

  const [lots, total] = await Promise.all([
    Lot.find(filter)
      .populate(
        'sellerId',
        'name organizationName district state'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .lean(),

    Lot.countDocuments(filter),
  ])

  return {
    lots,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  }
}

export const getMyLots = async ({
  sellerId,
  status,
  page = 1,
  limit = 20,
}) => {
  validateSellerId(sellerId)

  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  )

  const filter = {
    sellerId,
  }

  if (status) {
    filter.status = normalizeString(status)
  }

  const skip = (normalizedPage - 1) * normalizedLimit

  const [lots, total] = await Promise.all([
    Lot.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .lean(),

    Lot.countDocuments(filter),
  ])

  return {
    lots,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  }
}

export const getLotById = async (lotId) => {
  if (!mongoose.Types.ObjectId.isValid(lotId)) {
    const error = new Error('Invalid lot ID.')
    error.statusCode = 400
    throw error
  }

  const lot = await Lot.findById(lotId)
    .populate(
      'sellerId',
      'name organizationName district state'
    )
    .lean()

  if (!lot) {
    const error = new Error('Lot not found.')
    error.statusCode = 404
    throw error
  }

  return lot
}

export const updateLot = async ({
  lotId,
  sellerId,
  sellerRole,
  data,
}) => {
  validateSellerId(sellerId)

  if (!SELLER_ROLES.includes(sellerRole)) {
    const error = new Error(
      'Only farmers and FPOs can update crop lots.'
    )
    error.statusCode = 403
    throw error
  }

  if (!mongoose.Types.ObjectId.isValid(lotId)) {
    const error = new Error('Invalid lot ID.')
    error.statusCode = 400
    throw error
  }

  const existingLot = await Lot.findOne({
    _id: lotId,
    sellerId,
  })

  if (!existingLot) {
    const error = new Error(
      'Lot not found or you are not authorized to modify it.'
    )
    error.statusCode = 404
    throw error
  }

  if (['sold', 'cancelled'].includes(existingLot.status)) {
    const error = new Error(
      `A ${existingLot.status} lot cannot be modified.`
    )
    error.statusCode = 409
    throw error
  }

  const allowedFields = [
    'commodity',
    'quantity',
    'unit',
    'grade',
    'expectedPrice',
    'pickupLocation',
    'availableDate',
    'transportation',
    'images',
  ]

  const updateData = {}

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field]
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error('No valid fields provided for update.')
    error.statusCode = 400
    throw error
  }

  const mergedData = {
    commodity: updateData.commodity ?? existingLot.commodity,
    quantity: updateData.quantity ?? existingLot.quantity,
    unit: updateData.unit ?? existingLot.unit,
    grade: updateData.grade ?? existingLot.grade,
    expectedPrice:
      updateData.expectedPrice ?? existingLot.expectedPrice,
    pickupLocation:
      updateData.pickupLocation ?? existingLot.pickupLocation,
    availableDate:
      updateData.availableDate ?? existingLot.availableDate,
    transportation:
      updateData.transportation ?? existingLot.transportation,
    images: updateData.images ?? existingLot.images,
  }

  const validatedData = validateLotData(mergedData)

  Object.assign(existingLot, validatedData)

  await existingLot.save()

  return existingLot
}

export const cancelLot = async ({
  lotId,
  sellerId,
  sellerRole,
}) => {
  validateSellerId(sellerId)

  if (!SELLER_ROLES.includes(sellerRole)) {
    const error = new Error(
      'Only farmers and FPOs can cancel crop lots.'
    )
    error.statusCode = 403
    throw error
  }

  if (!mongoose.Types.ObjectId.isValid(lotId)) {
    const error = new Error('Invalid lot ID.')
    error.statusCode = 400
    throw error
  }

  const lot = await Lot.findOne({
    _id: lotId,
    sellerId,
  })

  if (!lot) {
    const error = new Error(
      'Lot not found or you are not authorized to cancel it.'
    )
    error.statusCode = 404
    throw error
  }

  if (lot.status === 'sold') {
    const error = new Error('A sold lot cannot be cancelled.')
    error.statusCode = 409
    throw error
  }

  if (lot.status === 'cancelled') {
    return lot
  }

  lot.status = 'cancelled'

  await lot.save()

  return lot
}