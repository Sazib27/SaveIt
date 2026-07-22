const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
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
            "facebook",
            "tiktok",
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
        default: "completed"
    },

    downloadCount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "Download",
    downloadSchema
);