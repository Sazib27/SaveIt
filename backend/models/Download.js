const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    originalUrl: {
      type: String,
      required: true
    },

    sourcePlatform: {
      type: String,
      enum: [
        "youtube",
        "instagram",
        "tiktok",
        "facebook",
        "twitter",
        "pinterest",
        "unknown"
      ],
      default: "unknown"
    },

    mediaType: {
      type: String,
      enum: ["video", "audio"],
      default: "video"
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    thumbnail: {
      type: String,
      default: ""
    },

    duration: {
      type: Number,
      default: 0
    },

    quality: {
      type: String,
      default: "720p"
    },

    format: {
      type: String,
      enum: ["mp4", "mp3", "webm", "mkv"],
      default: "mp4"
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      default: 0
    },

    downloadStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed"
      ],
      default: "pending"
    },

    downloadSpeed: {
      type: String,
      default: ""
    },

    errorMessage: {
      type: String,
      default: ""
    },

    isPremiumDownload: {
      type: Boolean,
      default: false
    },

    downloadCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Download",
  downloadSchema
);