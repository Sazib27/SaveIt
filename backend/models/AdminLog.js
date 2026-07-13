const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: {
      type: String,
      required: true
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    details: {
      type: String
    },

    ipAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AdminLog",
  adminLogSchema
);