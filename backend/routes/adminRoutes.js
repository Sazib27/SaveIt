const express = require("express");

const router = express.Router();

const {

  getStats,

  getUsers,

  deleteUser,

  togglePremium,

  getDownloads

} = require(
  "../controllers/adminController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const {
  adminOnly
} = require(
  "../middleware/adminMiddleware"
);

router.get(
  "/stats",
  protect,
  adminOnly,
  getStats
);

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

router.put(
  "/users/premium/:id",
  protect,
  adminOnly,
  togglePremium
);

router.get(
  "/downloads",
  protect,
  adminOnly,
  getDownloads
);

module.exports = router;