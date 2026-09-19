import mongoose from "mongoose";

import User from "../models/user.model.js";
import Demand from "../models/demand.model.js";

const BUYER_ROLE = "buyer";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const normalizePage = (page) => Math.max(Number.parseInt(page, 10) || 1, 1);

const normalizeLimit = (limit) =>
  Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);

const buildBuyerProfile = (buyer, demandCount, matchedDemandCount) => ({
  id: buyer._id.toString(),
  name: buyer.name || buyer.organizationName || "Buyer",
  organizationName: buyer.organizationName || "",
  businessType: buyer.businessType || "",
  mobile: buyer.mobile || "",
  email: buyer.email || "",
  district: buyer.district || "",
  state: buyer.state || "",
  activeDemandCount: demandCount,
  matchedDemandCount,
});

const getRecommendationScore = ({ demand, lot }) => {
  let score = 0;

  const lotCommodity = normalizeValue(lot.commodity);
  const demandCommodity = normalizeValue(demand.commodity);

  if (lotCommodity && demandCommodity && lotCommodity === demandCommodity) {
    score += 60;
  }

  const lotDistrict = normalizeValue(lot.pickupLocation?.district);
  const demandDistrict = normalizeValue(demand.deliveryLocation?.district);

  if (lotDistrict && demandDistrict && lotDistrict === demandDistrict) {
    score += 20;
  }

  const lotState = normalizeValue(lot.pickupLocation?.state);
  const demandState = normalizeValue(demand.deliveryLocation?.state);

  if (lotState && demandState && lotState === demandState) {
    score += 10;
  }

  const lotGrade = normalizeValue(lot.grade);
  const demandGrade = normalizeValue(demand.grade);

  if (lotGrade && demandGrade && lotGrade === demandGrade) {
    score += 10;
  }

  return score;
};

export const getRecommendedBuyers = async ({
  farmerId,
  lotId,
  page = 1,
  limit = 10,
}) => {
  if (!mongoose.Types.ObjectId.isValid(farmerId)) {
    throw new Error("Invalid farmer ID.");
  }

  if (!mongoose.Types.ObjectId.isValid(lotId)) {
    throw new Error("Invalid lot ID.");
  }

  const currentPage = normalizePage(page);
  const pageLimit = normalizeLimit(limit);

  const Lot = mongoose.model("Lot");

  const lot = await Lot.findOne({
    _id: lotId,
    sellerId: farmerId,
    status: "listed",
  }).lean();

  if (!lot) {
    throw new Error("Active lot not found.");
  }

  const activeDemands = await Demand.find({
    status: "active",
    deadline: { $gt: new Date() },
  })
    .populate(
      "buyerId",
      "name organizationName mobile email businessType district state role"
    )
    .sort({ createdAt: -1 })
    .lean();

  const buyerMatches = new Map();

  for (const demand of activeDemands) {
    const buyer = demand.buyerId;

    if (!buyer || buyer.role !== BUYER_ROLE) {
      continue;
    }

    const score = getRecommendationScore({
      demand,
      lot,
    });

    if (score <= 0) {
      continue;
    }

    const buyerId = buyer._id.toString();
    const existing = buyerMatches.get(buyerId);

    if (!existing || score > existing.score) {
      buyerMatches.set(buyerId, {
        buyer,
        score,
        matchedDemandCount: existing
          ? existing.matchedDemandCount + 1
          : 1,
      });
    } else {
      existing.matchedDemandCount += 1;
    }
  }

  const buyerIds = [...buyerMatches.keys()];

  if (!buyerIds.length) {
    return {
      buyers: [],
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total: 0,
        totalPages: 0,
      },
      lot: {
        id: lot._id.toString(),
        commodity: lot.commodity,
        quantity: lot.quantity,
        unit: lot.unit,
        grade: lot.grade,
      },
    };
  }

  const buyers = await User.find({
    _id: { $in: buyerIds },
    role: BUYER_ROLE,
  })
    .select(
      "name organizationName mobile email businessType district state"
    )
    .lean();

  const buyerLookup = new Map(
    buyers.map((buyer) => [buyer._id.toString(), buyer])
  );

  const rankedBuyers = [...buyerMatches.values()]
    .map(({ buyer, score, matchedDemandCount }) => {
      const currentBuyer = buyerLookup.get(buyer._id.toString());

      if (!currentBuyer) {
        return null;
      }

      return {
        buyer: currentBuyer,
        score,
        matchedDemandCount,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.matchedDemandCount !== a.matchedDemandCount) {
        return b.matchedDemandCount - a.matchedDemandCount;
      }

      return String(a.buyer.name || "").localeCompare(
        String(b.buyer.name || "")
      );
    });

  const total = rankedBuyers.length;
  const startIndex = (currentPage - 1) * pageLimit;
  const paginatedBuyers = rankedBuyers.slice(
    startIndex,
    startIndex + pageLimit
  );

  const result = paginatedBuyers.map(
    ({ buyer, matchedDemandCount }) =>
      buildBuyerProfile(
        buyer,
        activeDemands.filter(
          (demand) =>
            demand.buyerId?._id?.toString() === buyer._id.toString()
        ).length,
        matchedDemandCount
      )
  );

  return {
    buyers: result,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
    lot: {
      id: lot._id.toString(),
      commodity: lot.commodity,
      quantity: lot.quantity,
      unit: lot.unit,
      grade: lot.grade,
    },
  };
};