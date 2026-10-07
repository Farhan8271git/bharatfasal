import {
  getWarehouses,
  getTransportProviders,
  createLogisticsBooking,
  getMyLogisticsBookings,
  getLogisticsBookingById,
} from "../services/logistics.service.js";

const getErrorStatus = (error) => {
  if (error?.statusCode) {
    return error.statusCode;
  }

  if (
    error?.message === "Warehouse not found." ||
    error?.message === "Transport provider not found." ||
    error?.message === "Logistics booking not found."
  ) {
    return 404;
  }

  return 400;
};

export const getWarehousesController = async (
  req,
  res
) => {
  try {
    const result = await getWarehouses({
      district: req.query.district,
      state: req.query.state,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Warehouses retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve warehouses.",
    });
  }
};

export const getTransportProvidersController = async (
  req,
  res
) => {
  try {
    const result = await getTransportProviders({
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message:
        "Transport providers retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve transport providers.",
    });
  }
};

export const createLogisticsBookingController = async (
  req,
  res
) => {
  try {
    const booking = await createLogisticsBooking({
      userId: req.user.id,
      type: req.body.type,
      warehouseId: req.body.warehouseId,
      transportProviderId:
        req.body.transportProviderId,
      quantity: req.body.quantity,
      pickupLocation: req.body.pickupLocation,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      distanceKm: req.body.distanceKm,
    });

    return res.status(201).json({
      success: true,
      message: "Logistics booking created successfully.",
      booking,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to create logistics booking.",
    });
  }
};

export const getMyLogisticsBookingsController = async (
  req,
  res
) => {
  try {
    const result = await getMyLogisticsBookings({
      userId: req.user.id,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message:
        "Logistics bookings retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve logistics bookings.",
    });
  }
};

export const getLogisticsBookingByIdController = async (
  req,
  res
) => {
  try {
    const booking = await getLogisticsBookingById({
      bookingId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Logistics booking retrieved successfully.",
      booking,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve logistics booking.",
    });
  }
};