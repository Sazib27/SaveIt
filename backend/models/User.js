// backend/models/User.js
// User Model - Database schema for user authentication and profile

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // Personal Information
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: null,
    },

    // Account Status
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Account Statistics
    totalDownloads: {
      type: Number,
      default: 0,
    },
    totalDataDownloaded: {
      type: Number, // in bytes
      default: 0,
    },

    // User Preferences
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // Account Activity
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Timestamps
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

// Update the updatedAt field before saving
UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ isPremium: 1 });

module.exports = mongoose.model('User', UserSchema);
