import {
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
} from "../services/order.service.js";

const getErrorStatus = (error) => {
  if (error?.statusCode) {
    return error.statusCode;
  }

  if (error?.message === "Order not found.") {
    return 404;
  }

  if (error?.message === "Access denied.") {
    return 403;
  }

  return 400;
};

export const getBuyerOrdersController = async (req, res) => {
  try {
    const result = await getBuyerOrders({
      buyerId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Buyer orders retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message: error?.message || "Unable to retrieve buyer orders.",
    });
  }
};

export const getSellerOrdersController = async (req, res) => {
  try {
    const result = await getSellerOrders({
      sellerId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message: error?.message || "Unable to retrieve seller orders.",
    });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const order = await getOrderById({
      orderId: req.params.id,
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      order,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message: error?.message || "Unable to retrieve order.",
    });
  }
};