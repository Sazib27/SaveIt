const User =
  require("../models/User");

const Download =
  require("../models/Download");

const Payment =
  require("../models/Payment");

exports.getStats =
  async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalDownloads =
      await Download.countDocuments();

    const premiumUsers =
      await User.countDocuments({
        isPremium: true
      });

    const payments =
      await Payment.find({
        status: "success"
      });

    const totalRevenue =
      payments.reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

    res.json({

      success: true,

      stats: {

        totalUsers,

        totalDownloads,

        premiumUsers,

        totalRevenue

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getUsers =
  async (req, res) => {

  try {

    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1
        });

    res.json({

      success: true,

      users

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.deleteUser =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    await user.deleteOne();

    res.json({

      success: true,

      message:
        "User deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.togglePremium =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.isPremium =
      !user.isPremium;

    await user.save();

    res.json({

      success: true,

      message:
        "Premium updated"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getDownloads =
  async (req, res) => {

  try {

    const downloads =
      await Download.find()

      .populate(
        "user",
        "email"
      )

      .sort({
        createdAt: -1
      })

      .limit(50);

    res.json({

      success: true,

      downloads

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};