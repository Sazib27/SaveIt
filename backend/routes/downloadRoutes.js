const express = require("express");

const router = express.Router();

const {
    fetchMedia,
    startDownload,
    getSingleDownload,
    deleteDownload
} = require("../controllers/downloadController");

const {
    protect
} = require("../middleware/authMiddleware");


// =======================================
// Public Routes
// =======================================

// Fetch media information
router.post(
    "/fetch",
    fetchMedia
);

// Download video/audio
router.post(
    "/start",
    startDownload
);


// =======================================
// Protected Routes
// =======================================

// Get single download history
router.get(
    "/:id",
    protect,
    getSingleDownload
);

// Delete download history
router.delete(
    "/:id",
    protect,
    deleteDownload
);

module.exports = router;