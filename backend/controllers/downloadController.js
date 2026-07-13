const fs = require("fs");

const path = require("path");

const Download =
  require("../models/Download");

const {

  fetchMetadata,

  downloadVideo,

  downloadAudio,

  detectPlatform

} = require("../utils/ytDownloader");

exports.fetchMedia =
  async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {

      return res.status(400).json({
        success: false,
        message: "URL required"
      });

    }

    const metadata =
      await fetchMetadata(url);

    if (!metadata.success) {

      return res.status(500).json({
        success: false,
        message: metadata.message
      });

    }

    res.json(metadata);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.startDownload = async (req, res) => {
  try {
    console.log("========== DOWNLOAD START ==========");

    const { url, type = "mp4", quality = "720" } = req.body;

    console.log("URL:", url);
    console.log("Type:", type);
    console.log("Quality:", quality);

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL required"
      });
    }

    let result;

    if (type === "mp3") {
      console.log("Downloading audio...");
      result = await downloadAudio(url);
    } else {
      console.log("Downloading video...");
      result = await downloadVideo(url, quality, "mp4");
    }

    console.log("Downloader Result:");
    console.log(result);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message
      });
    }

    if (!fs.existsSync(result.filePath)) {
      return res.status(500).json({
        success: false,
        message: "Downloaded file not found."
      });
    }

    const stats = fs.statSync(result.filePath);

    const download = await Download.create({
      user: req.user ? req.user._id : null,

      originalUrl: url,

      sourcePlatform: result.platform,

      mediaType: type === "mp3" ? "audio" : "video",

      title: result.title,

      thumbnail: result.thumbnail,

      duration: result.duration,

      quality: quality + "p",

      format: type,

      fileName: result.fileName,

      filePath: result.filePath,

      fileUrl: result.fileUrl,

      fileSize: stats.size,

      downloadStatus: "completed"
    });

    console.log("Download saved in MongoDB");

    return res.status(200).json({
      success: true,
      message: "Download completed successfully",
      download
    });

  } catch (error) {

    console.error("DOWNLOAD ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.downloadFile = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found"
      });
    }

    if (!fs.existsSync(download.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server"
      });
    }

    return res.download(
      download.filePath,
      download.fileName,
      (err) => {
        if (err) {
          console.error(err);

          if (!res.headersSent) {
            return res.status(500).json({
              success: false,
              message: "Failed to send file"
            });
          }
        }
      }
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteDownload =
  async (req, res) => {

  try {

    const download =
      await Download.findById(
        req.params.id
      );

    if (!download) {

      return res.status(404).json({
        success: false,
        message: "Download not found"
      });

    }

    if (
      download.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });

    }

    if (
      fs.existsSync(download.filePath)
    ) {

      fs.unlinkSync(
        download.filePath
      );

    }

    await download.deleteOne();

    res.json({

      success: true,

      message:
        "Download deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getSingleDownload =
  async (req, res) => {

  try {

    const download =
      await Download.findById(
        req.params.id
      );

    if (!download) {

      return res.status(404).json({
        success: false,
        message: "Download not found"
      });

    }

    res.json({

      success: true,

      download

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
