import {
  createDemand,
  getBuyerDemands,
  getMarketDemands,
  getDemandById,
  cancelDemand,
} from "../services/demand.service.js";

const getErrorStatus = (error) => {
  const message = error?.message || "";

  if (message === "Access denied.") {
    return 403;
  }

  if (
    message === "Demand not found." ||
    message.includes("Active demand not found")
  ) {
    return 404;
  }

  return 400;
};

export const createDemandController = async (req, res) => {
  try {
    const demand = await createDemand({
      buyerId: req.user.id,
      commodity: req.body.commodity,
      quantity: req.body.quantity,
      grade: req.body.grade,
      estimatedPrice: req.body.estimatedPrice,
      deliveryLocation: req.body.deliveryLocation,
      deadline: req.body.deadline,
      transportation: req.body.transportation,
    });

    return res.status(201).json({
      success: true,
      message: "Buyer demand created successfully.",
      demand,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to create buyer demand.",
    });
  }
};

export const getBuyerDemandsController = async (req, res) => {
  try {
    const result = await getBuyerDemands({
      buyerId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Buyer demands retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve buyer demands.",
    });
  }
};

export const getDemandByIdController = async (req, res) => {
  try {
    const demand = await getDemandById({
      demandId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Buyer demand retrieved successfully.",
      demand,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve buyer demand.",
    });
  }
};

export const cancelDemandController = async (req, res) => {
  try {
    const demand = await cancelDemand({
      demandId: req.params.id,
      buyerId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Buyer demand cancelled successfully.",
      demand,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to cancel buyer demand.",
    });
  }
}; 


export const getMarketDemandsController = async (req, res) => {
  try {
    const result = await getMarketDemands({
      status: req.query.status || "active",
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Market demands retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve market demands.",
    });
  }
};