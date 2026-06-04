// backend/models/Download.js
// Download Model - Database schema for tracking user downloads

const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema(
  {
    // User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Download Information
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'pinterest'],
      required: true,
    },

    // Media Details
    mediaType: {
      type: String,
      enum: ['video', 'audio', 'image'],
      required: true,
    },
    format: {
      type: String,
      enum: ['mp4', 'mp3', 'webm', 'jpg', 'png'],
    },
    quality: {
      type: String,
      default: 'standard',
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number, // in bytes
      default: 0,
    },

    // Download Status
    status: {
      type: String,
      enum: ['pending', 'downloading', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    downloadPath: {
      type: String,
      default: null,
    },
    downloadedAt: {
      type: Date,
      default: null,
    },

    // Download Progress
    progress: {
      type: Number, // 0-100
      default: 0,
    },
    error: {
      type: String,
      default: null,
    },

    // Premium Status
    isPremium: {
      type: Boolean,
      default: false,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
DownloadSchema.index({ userId: 1 });
DownloadSchema.index({ status: 1 });
DownloadSchema.index({ platform: 1 });
DownloadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Download', DownloadSchema);
