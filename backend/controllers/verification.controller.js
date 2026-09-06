import Verification from "../models/verification.model.js";
import User from "../models/user.model.js";

export const submitBuyerVerification = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers can submit buyer verification",
      });
    }

    const {
      businessName,
      businessType,
      address,
      pan,
      gstin,
      documents,
      bankName,
      accountNumber,
      ifsc,
      upi,
    } = req.body;

    if (!businessName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business name is required",
      });
    }

    if (!businessType?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business type is required",
      });
    }

    if (!address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Business address is required",
      });
    }

    if (!pan?.trim()) {
      return res.status(400).json({
        success: false,
        message: "PAN is required",
      });
    }

    if (!gstin?.trim()) {
      return res.status(400).json({
        success: false,
        message: "GSTIN is required",
      });
    }

    if (!documents?.pan) {
      return res.status(400).json({
        success: false,
        message: "PAN document is required",
      });
    }

    if (!documents?.gst) {
      return res.status(400).json({
        success: false,
        message: "GST registration document is required",
      });
    }

    if (!documents?.businessProof) {
      return res.status(400).json({
        success: false,
        message: "Business proof is required",
      });
    }

    if (!documents?.bankProof) {
      return res.status(400).json({
        success: false,
        message: "Bank account proof is required",
      });
    }

    if (!bankName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bank name is required",
      });
    }

    if (!accountNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    }

    if (!ifsc?.trim()) {
      return res.status(400).json({
        success: false,
        message: "IFSC is required",
      });
    }

    const verification = await Verification.findOneAndUpdate(
      { userId },
      {
        userId,
        type: "buyer",

        name: user.name,
        phone: user.mobile,
        email: user.email || "",

        businessName: businessName.trim(),
        companyName: businessName.trim(),
        businessType: businessType.trim(),

        address: address.trim(),
        location: `${user.district}, ${user.state}`,

        pan: pan.trim().toUpperCase(),
        gstin: gstin.trim().toUpperCase(),

        documents: {
          pan: Boolean(documents.pan),
          gst: Boolean(documents.gst),
          businessProof: Boolean(documents.businessProof),
          bankProof: Boolean(documents.bankProof),
        },

        bankName: bankName.trim(),
        bankAccount: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        upi: upi?.trim() || "",

        status: "pending",
        rejectionReason: "",
        submittedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Verification submitted successfully",
      verification,
    });
  } catch (error) {
    console.error("Buyer verification submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit verification",
    });
  }
};

export const getMyVerification = async (req, res) => {
  try {
    const verification = await Verification.findOne({
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      verification: verification || null,
    });
  } catch (error) {
    console.error("Get verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get verification status",
    });
  }
};