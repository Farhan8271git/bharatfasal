import {
  createPurchaseRequest,
  getBuyerPurchaseRequests,
  getSellerPurchaseRequests,
  getPurchaseRequestById,
  respondToPurchaseRequest,
} from "../services/purchaseRequest.service.js";

const getErrorStatus = (error) => {
  const message = error?.message || "";

  if (
    message === "Access denied." ||
    message.includes("cannot purchase your own lot")
  ) {
    return 403;
  }

  if (
    message === "Lot not found." ||
    message === "Purchase request not found."
  ) {
    return 404;
  }

  return 400;
};

export const createPurchaseRequestController = async (
  req,
  res
) => {
  try {
    const request = await createPurchaseRequest({
      buyerId: req.user.id,
      lotId: req.body.lotId,
      quantity: req.body.quantity,
      buyerNote: req.body.buyerNote,
    });

    return res.status(201).json({
      success: true,
      message: "Purchase request created successfully.",
      request,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to create purchase request.",
    });
  }
};

export const getBuyerPurchaseRequestsController = async (
  req,
  res
) => {
  try {
    const result = await getBuyerPurchaseRequests({
      buyerId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Buyer purchase requests retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve purchase requests.",
    });
  }
};

export const getSellerPurchaseRequestsController = async (
  req,
  res
) => {
  try {
    const result = await getSellerPurchaseRequests({
      sellerId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Seller purchase requests retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve purchase requests.",
    });
  }
};

export const getPurchaseRequestByIdController = async (
  req,
  res
) => {
  try {
    const request = await getPurchaseRequestById({
      requestId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Purchase request retrieved successfully.",
      request,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve purchase request.",
    });
  }
};

export const respondToPurchaseRequestController = async (
  req,
  res
) => {
  try {
    const result = await respondToPurchaseRequest({
      requestId: req.params.id,
      sellerId: req.user.id,
      action: req.body.action,
      sellerNote: req.body.sellerNote,
    });

    if (req.body.action === "accept") {
      return res.status(200).json({
        success: true,
        message: "Purchase request accepted successfully.",
        request: result.request,
        order: result.order,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase request rejected successfully.",
      request: result.request,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to respond to purchase request.",
    });
  }
};