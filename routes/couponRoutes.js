const express = require("express");
const {
  getCoupon,
  claimCoupon,
  getAllCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
} = require("../controllers/couponController");
const { isAuthenticated } = require("../middlewares/auth");
const { sessionTracker } = require("../middlewares/sessionTracker");

const router = express.Router();

// public
router.get("/next", sessionTracker, getCoupon);
router.post("/claim", sessionTracker, claimCoupon);

//admin
router.get("/", isAuthenticated, getAllCoupons);
router.post("/", isAuthenticated, addCoupon);
router.put("/:id", isAuthenticated, updateCoupon);
router.delete("/:id", isAuthenticated, deleteCoupon);
router.get("/claims", isAuthenticated, getClaimHistory);

module.exports = router;
