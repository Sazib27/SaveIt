const path = require("path");

const {

  convertToMp3,

  convertVideoQuality,

  generateThumbnail,

  compressVideo,

  getMediaInfo

} = require(
  "../utils/mediaProcessor"
);

exports.extractMp3 =
  async (req, res) => {

  try {

    const {
      inputPath,
      outputName
    } = req.body;

    const result =
      await convertToMp3(
        inputPath,
        outputName
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.changeQuality =
  async (req, res) => {

  try {

    const {
      inputPath,
      outputName,
      resolution
    } = req.body;

    const result =
      await convertVideoQuality(
        inputPath,
        outputName,
        resolution
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.createThumbnail =
  async (req, res) => {

  try {

    const {
      inputPath,
      outputName
    } = req.body;

    const result =
      await generateThumbnail(
        inputPath,
        outputName
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.compressMedia =
  async (req, res) => {

  try {

    const {
      inputPath,
      outputName
    } = req.body;

    const result =
      await compressVideo(
        inputPath,
        outputName
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.mediaInfo =
  async (req, res) => {

  try {

    const {
      inputPath
    } = req.body;

    const result =
      await getMediaInfo(
        inputPath
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};