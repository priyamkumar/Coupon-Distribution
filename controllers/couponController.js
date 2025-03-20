const Coupon = require("../models/couponModel");
const Claim = require("../models/claimModel");

const getCoupon = async (req, res) => {
  try {
    const availableCoupon = await Coupon.findOne({
      isUsed: false,
      isActive: true,
    }).sort({ createdAt: 1 });
    if (!availableCoupon) {
      return res.status(404).json({
        success: false,
        message: "No coupons are available.",
      });
    }
    return res.status(200).json({
      success: true,
      code: availableCoupon.code,
      info: availableCoupon.description,
    });
  } catch (err) {
    console.error("Unable to fetch available coupon!", err);
    return res.status(500).json({
      success: false,
      message: "Server is unable to process your request.",
    });
  }
};

const claimCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const ipAddress = req.ip;
    const sessionId = req.cookies.sessionId;
    const cooldownPeriod = 2 * 24 * 60 * 60 * 1000;
    const recentClaim = await Claim.findOne({
      $or: [{ ipAddress }, { sessionId }],
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) },
    });
    if (recentClaim) {
      return res.status(429).json({
        success: false,
        message:
          "You have already claimed a coupon recently. Please try again later.",
      });
    }
    const coupon = await Coupon.findOne({
      _id: couponId,
      isUsed: false,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not available or has already been claimed.",
      });
    }

    const newClaim = await Claim.create({
      ipAddress,
      sessionId,
      couponId: coupon._id,
    });

    coupon.isUsed = true;
    coupon.claimedBy = newClaim._id;
    coupon.updatedAt = Date.now();
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon claimed successfully!",
      coupon: {
        code: coupon.code,
        description: coupon.description,
      },
    });
  } catch (err) {
    console.error("Error claiming coupon: ", error);
    return res.status(500).json({
      success: false,
      message: "Server is unable to process your request.",
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate("claimedBy");

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (err) {
    console.error("Unable to fetch coupons!", err);
    return res.status(500).json({
      success: false,
      message: "Server is unable to process your request.",
    });
  }
};

const addCoupon = async (req, res) => {
  try {
    const { code, description, isActive } = req.body;
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists.",
      });
    }

    const newCoupon = await Coupon.create({
      code,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon added successfully.",
      data: newCoupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding coupon.",
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, isActive } = req.body;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (code) coupon.code = code;
    if (description !== undefined) coupon.description = description;
    if (isActive !== undefined) coupon.isActive = isActive;
    coupon.updatedAt = Date.now();

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      data: coupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating coupon.",
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    await Coupon.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
      data: coupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting coupon.",
    });
  }
};

const getClaimHistory = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("couponId")
      .sort({ claimedAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (err) {
    console.error("Error fetching claim history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching claim history.",
    });
  }
};

module.exports = {
  getCoupon,
  claimCoupon,
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
};
