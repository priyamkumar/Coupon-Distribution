const mongoose = require("mongoose");

const claimSchema = mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Claim", claimSchema);

