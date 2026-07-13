const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    premiumPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Premium"
    },

    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    gatewayTransactionId: {
      type: String,
      default: ""
    },

    paymentMethod: {
      type: String,
      enum: [
        "sslcommerz",
        "bkash",
        "nagad",
        "rocket",
        "card"
      ],
      default: "sslcommerz"
    },

    currency: {
      type: String,
      default: "BDT"
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "success",
        "failed",
        "cancelled"
      ],
      default: "pending"
    },

    paidAt: {
      type: Date
    },

    gatewayResponse: {
      type: Object
    },

    invoiceUrl: {
      type: String,
      default: ""
    },

    refundStatus: {
      type: String,
      enum: [
        "none",
        "requested",
        "refunded"
      ],
      default: "none"
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);