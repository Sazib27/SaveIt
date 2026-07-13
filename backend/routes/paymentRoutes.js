const express = require("express");

const router = express.Router();

const {

  initializePayment,

  paymentSuccess,

  paymentFail,

  paymentCancel,

  paymentIPN,

  getPaymentHistory,

  verifyPayment

} = require(
  "../controllers/paymentController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/sslcommerz",
  protect,
  initializePayment
);

router.post(
  "/ipn",
  paymentIPN
);

router.get(
  "/success/:transactionId",
  paymentSuccess
);

router.get(
  "/fail/:transactionId",
  paymentFail
);

router.get(
  "/cancel/:transactionId",
  paymentCancel
);

router.get(
  "/history",
  protect,
  getPaymentHistory
);

router.get(
  "/verify/:transactionId",
  protect,
  verifyPayment
);

module.exports = router;