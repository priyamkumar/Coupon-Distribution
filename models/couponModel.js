const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);

