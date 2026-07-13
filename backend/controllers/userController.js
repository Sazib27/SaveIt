const User =
  require("../models/User");

const Download =
  require("../models/Download");

exports.getProfile =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json({

      success: true,

      user

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.updateProfile =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.name =
      req.body.name || user.name;

    user.avatar =
      req.body.avatar || user.avatar;

    user.bio =
      req.body.bio || user.bio;

    await user.save();

    res.json({

      success: true,

      message:
        "Profile updated",

      user

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getHistory =
  async (req, res) => {

  try {

    const downloads =
      await Download.find({
        user: req.user._id
      })

      .sort({
        createdAt: -1
      });

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

exports.deleteHistory =
  async (req, res) => {

  try {

    const download =
      await Download.findOne({

        _id: req.params.id,

        user: req.user._id

      });

    if (!download) {

      return res.status(404).json({
        success: false,
        message: "History not found"
      });

    }

    await download.deleteOne();

    res.json({

      success: true,

      message:
        "History deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.clearHistory =
  async (req, res) => {

  try {

    await Download.deleteMany({
      user: req.user._id
    });

    res.json({

      success: true,

      message:
        "History cleared"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getUserStats =
  async (req, res) => {

  try {

    const totalDownloads =
      await Download.countDocuments({
        user: req.user._id
      });

    const videoDownloads =
      await Download.countDocuments({

        user: req.user._id,

        mediaType: "video"

      });

    const audioDownloads =
      await Download.countDocuments({

        user: req.user._id,

        mediaType: "audio"

      });

    res.json({

      success: true,

      stats: {

        totalDownloads,

        videoDownloads,

        audioDownloads,

        isPremium:
          req.user.isPremium

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};