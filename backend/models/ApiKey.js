const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    key: {
      type: String,
      unique: true
    },

    name: {
      type: String
    },

    requestsUsed: {
      type: Number,
      default: 0
    },

    requestsLimit: {
      type: Number,
      default: 10000
    },

    active: {
      type: Boolean,
      default: true
    },

    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ApiKey",
  apiKeySchema
);