const express = require("express");

const router = express.Router();

const {

  fetchMedia,

  startDownload,

  deleteDownload,

  getSingleDownload,
  downloadFile

} = require(
  "../controllers/downloadController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/fetch",
  protect,
  fetchMedia
);

router.post(
  "/start",
  protect,
  startDownload
);

router.get("/file/:id", downloadFile);

router.get(
  "/:id",
  protect,
  getSingleDownload
);

router.delete(
  "/:id",
  protect,
  deleteDownload
);

module.exports = router;