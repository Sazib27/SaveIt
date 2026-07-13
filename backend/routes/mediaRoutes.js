const express = require("express");

const router = express.Router();

const {

  extractMp3,

  changeQuality,

  createThumbnail,

  compressMedia,

  mediaInfo

} = require(
  "../controllers/mediaController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/extract-mp3",
  protect,
  extractMp3
);

router.post(
  "/quality",
  protect,
  changeQuality
);

router.post(
  "/thumbnail",
  protect,
  createThumbnail
);

router.post(
  "/compress",
  protect,
  compressMedia
);

router.post(
  "/info",
  protect,
  mediaInfo
);

module.exports = router;