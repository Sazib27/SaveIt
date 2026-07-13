const crypto = require("crypto");

const Payment =
  require("../models/Payment");

const Premium =
  require("../models/Premium");

const User =
  require("../models/User");

const sslcz =
  require("../config/sslcommerz");

exports.initializePayment =
  async (req, res) => {

  try {

    const {
      premiumPlanId
    } = req.body;

    const plan =
      await Premium.findById(
        premiumPlanId
      );

    if (!plan) {

      return res.status(404).json({
        success: false,
        message: "Premium plan not found"
      });

    }

    const transactionId =
      crypto.randomBytes(16)
        .toString("hex");

    const payment =
      await Payment.create({

        user: req.user._id,

        premiumPlan:
          plan._id,

        transactionId,

        amount:
          plan.price,

        status:
          "pending"

      });

    const data = {

      total_amount:
        plan.price,

      currency:
        plan.currency || "BDT",

      tran_id:
        transactionId,

      success_url:
        `${process.env.SERVER_URL}/api/payment/success/${transactionId}`,

      fail_url:
        `${process.env.SERVER_URL}/api/payment/fail/${transactionId}`,

      cancel_url:
        `${process.env.SERVER_URL}/api/payment/cancel/${transactionId}`,

      ipn_url:
        `${process.env.SERVER_URL}/api/payment/ipn`,

      shipping_method:
        "NO",

      product_name:
        plan.name,

      product_category:
        "Subscription",

      product_profile:
        "general",

      cus_name:
        req.user.name,

      cus_email:
        req.user.email,

      cus_add1:
        "Bangladesh",

      cus_city:
        "Dhaka",

      cus_country:
        "Bangladesh",

      cus_phone:
        "01700000000"

    };

    const apiResponse =
      await sslcz.init(data);

    res.json({

      success: true,

      paymentUrl:
        apiResponse.GatewayPageURL,

      transactionId

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.paymentSuccess =
  async (req, res) => {

  try {

    const {
      transactionId
    } = req.params;

    const payment =
      await Payment.findOne({
        transactionId
      });

    if (!payment) {

      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });

    }

    payment.status = "success";

    payment.paidAt = new Date();

    await payment.save();

    const user =
      await User.findById(
        payment.user
      );

    const premiumPlan =
      await Premium.findById(
        payment.premiumPlan
      );

    user.isPremium = true;

    user.premiumPlan =
      premiumPlan._id;

    user.premiumStartedAt =
      new Date();

    const expireDate =
      new Date();

    expireDate.setDate(
      expireDate.getDate() +
      premiumPlan.durationInDays
    );

    user.premiumExpiresAt =
      expireDate;

    await user.save();

    res.redirect(
      `${process.env.CLIENT_URL}/premium-success.html`
    );

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.paymentFail =
  async (req, res) => {

  try {

    const {
      transactionId
    } = req.params;

    const payment =
      await Payment.findOne({
        transactionId
      });

    if (payment) {

      payment.status = "failed";

      await payment.save();

    }

    res.redirect(
      `${process.env.CLIENT_URL}/premium-failed.html`
    );

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.paymentCancel =
  async (req, res) => {

  try {

    const {
      transactionId
    } = req.params;

    const payment =
      await Payment.findOne({
        transactionId
      });

    if (payment) {

      payment.status =
        "cancelled";

      await payment.save();

    }

    res.redirect(
      `${process.env.CLIENT_URL}/premium-cancel.html`
    );

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.paymentIPN =
  async (req, res) => {

  try {

    console.log(
      "SSLCommerz IPN:",
      req.body
    );

    res.status(200).send("OK");

  } catch (error) {

    res.status(500).send("ERROR");

  }

};

exports.getPaymentHistory =
  async (req, res) => {

  try {

    const payments =
      await Payment.find({
        user: req.user._id
      })

      .populate("premiumPlan")

      .sort({
        createdAt: -1
      });

    res.json({

      success: true,

      payments

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.verifyPayment =
  async (req, res) => {

  try {

    const {
      transactionId
    } = req.params;

    const payment =
      await Payment.findOne({
        transactionId
      });

    if (!payment) {

      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });

    }

    res.json({

      success: true,

      payment

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};