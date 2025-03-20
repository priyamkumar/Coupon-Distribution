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
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");
const { sessionTracker } = require("../middlewares/sessionTracker");

const router = express.Router();

// public
router.get("/next", sessionTracker, getCoupon);
router.post("/claim", sessionTracker, claimCoupon);

//admin
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllCoupons);
router.post("/", isAuthenticated, authorizeRoles("admin"), addCoupon);
router.put("/:id", isAuthenticated, authorizeRoles("admin"), updateCoupon);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCoupon);
router.get("/claims", isAuthenticated, authorizeRoles("admin"), getClaimHistory);

module.exports = router;
