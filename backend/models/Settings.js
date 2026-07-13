const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "SaveIt"
    },

    maintenanceMode: {
      type: Boolean,
      default: false
    },

    allowRegistrations: {
      type: Boolean,
      default: true
    },

    maxFileSizeMB: {
      type: Number,
      default: 500
    },

    allowGuestDownloads: {
      type: Boolean,
      default: false
    },

    defaultDownloadQuality: {
      type: String,
      default: "720p"
    },

    supportEmail: {
      type: String,
      default: "support@saveit.com"
    },

    sslcommerzEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);