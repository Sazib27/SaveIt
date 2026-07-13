const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    avatar: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    premiumPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Premium",
      default: null
    },

    premiumStartedAt: {
      type: Date
    },

    premiumExpiresAt: {
      type: Date
    },

    totalDownloads: {
      type: Number,
      default: 0
    },

    totalStorageUsed: {
      type: Number,
      default: 0
    },

    lastLogin: {
      type: Date
    },

    loginProvider: {
      type: String,
      enum: ["email", "google", "facebook"],
      default: "email"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
      type: String
    },

    resetPasswordToken: {
      type: String
    },

    resetPasswordExpire: {
      type: Date
    },

    deviceTokens: [
      {
        type: String
      }
    ],

    blocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);