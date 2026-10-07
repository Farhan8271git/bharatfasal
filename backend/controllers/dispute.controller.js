import {
  createDispute,
  getMyDisputes,
  getDisputeById,
} from "../services/dispute.service.js";

const getErrorStatus = (error) => {
  if (error?.statusCode) {
    return error.statusCode;
  }

  if (
    error?.message === "Dispute not found."
  ) {
    return 404;
  }

  return 400;
};

export const createDisputeController = async (
  req,
  res
) => {
  try {
    const dispute = await createDispute({
      userId: req.user.id,
      role: req.user.role,
      orderId: req.body.orderId,
      type: req.body.type,
      description: req.body.description,
    });

    return res.status(201).json({
      success: true,
      message: "Dispute filed successfully.",
      dispute,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to file dispute.",
    });
  }
};

export const getMyDisputesController = async (
  req,
  res
) => {
  try {
    const result = await getMyDisputes({
      userId: req.user.id,
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Disputes retrieved successfully.",
      ...result,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve disputes.",
    });
  }
};

export const getDisputeByIdController = async (
  req,
  res
) => {
  try {
    const dispute = await getDisputeById({
      disputeId: req.params.id,
      userId: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Dispute retrieved successfully.",
      dispute,
    });
  } catch (error) {
    return res.status(getErrorStatus(error)).json({
      success: false,
      message:
        error?.message ||
        "Unable to retrieve dispute.",
    });
  }
};