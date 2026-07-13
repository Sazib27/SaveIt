const mongoose = require("mongoose");

const premiumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String,
      default: ""
    },

    durationInDays: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "BDT"
    },

    maxDownloadsPerDay: {
      type: Number,
      default: 999999
    },

    hdDownloads: {
      type: Boolean,
      default: true
    },

    noAds: {
      type: Boolean,
      default: true
    },

    fasterQueue: {
      type: Boolean,
      default: true
    },

    unlimitedHistory: {
      type: Boolean,
      default: true
    },

    apiAccess: {
      type: Boolean,
      default: true
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Premium",
  premiumSchema
);