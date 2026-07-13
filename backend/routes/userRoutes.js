const express = require("express");

const router = express.Router();

const {

  getProfile,

  updateProfile,

  getHistory,

  deleteHistory,

  clearHistory,

  getUserStats

} = require(
  "../controllers/userController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.get(
  "/history",
  protect,
  getHistory
);

router.delete(
  "/history/:id",
  protect,
  deleteHistory
);

router.delete(
  "/history",
  protect,
  clearHistory
);

router.get(
  "/stats",
  protect,
  getUserStats
);

module.exports = router;