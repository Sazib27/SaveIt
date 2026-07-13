const ytDlp = require("yt-dlp-exec");

const path = require("path");

const fs = require("fs");

const downloadsDir =
  path.join(__dirname, "../downloads");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, {
    recursive: true
  });
}

const detectPlatform = (url) => {

  if (url.includes("youtube.com") ||
      url.includes("youtu.be")) {
    return "youtube";
  }

  if (url.includes("instagram.com")) {
    return "instagram";
  }

  if (url.includes("tiktok.com")) {
    return "tiktok";
  }

  if (url.includes("facebook.com")) {
    return "facebook";
  }

  if (url.includes("twitter.com") ||
      url.includes("x.com")) {
    return "twitter";
  }

  if (url.includes("pinterest.com")) {
    return "pinterest";
  }

  return "unknown";
};

const sanitizeFileName = (name) => {

  return name
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "_")
    .substring(0, 100);

};

const fetchMetadata = async (url) => {

  try {

    const info = await ytDlp(url, {

      dumpSingleJson: true,

      noWarnings: true,

      noCheckCertificates: true,

      preferFreeFormats: true,

      youtubeSkipDashManifest: true

    });

    return {

      success: true,

      platform: detectPlatform(url),

      title: info.title,

      description: info.description,

      duration: info.duration,

      thumbnail: info.thumbnail,

      uploader: info.uploader,

      viewCount: info.view_count,

      likeCount: info.like_count,

      formats: info.formats

    };

  } catch (error) {

    return {

      success: false,

      message: error.message

    };

  }

};

const downloadVideo = async (
  url,
  quality = "720",
  format = "mp4"
) => {

  try {

    const info = await ytDlp(url, {
      dumpSingleJson: true
    });

    const safeTitle =
      sanitizeFileName(info.title);

    const fileName =
      `${Date.now()}_${safeTitle}.${format}`;

    const outputPath =
      path.join(downloadsDir, fileName);

    let ytFormat = "";

    if (quality === "1080") {

      ytFormat =
        "bestvideo[height<=1080]+bestaudio/best";

    } else if (quality === "720") {

      ytFormat =
        "bestvideo[height<=720]+bestaudio/best";

    } else if (quality === "480") {

      ytFormat =
        "bestvideo[height<=480]+bestaudio/best";

    } else {

      ytFormat = "best";

    }

    await ytDlp(url, {
    output: outputPath,
    format: ytFormat,
    mergeOutputFormat: format,
    noWarnings: true,
    noCheckCertificates: true
});

    return {

      success: true,

      fileName,

      filePath: outputPath,

      fileUrl: `/downloads/${fileName}`,

      title: info.title,

      thumbnail: info.thumbnail,

      duration: info.duration,

      platform: detectPlatform(url)

    };

  } catch (error) {

    return {

      success: false,

      message: error.message

    };

  }

};

const downloadAudio = async (
  url,
  bitrate = "192"
) => {

  try {

    const info = await ytDlp(url, {
      dumpSingleJson: true
    });

    const safeTitle =
      sanitizeFileName(info.title);

    const fileName =
      `${Date.now()}_${safeTitle}.mp3`;

    const outputPath =
      path.join(downloadsDir, fileName);

    await ytDlp(url, {

      output: outputPath,

      extractAudio: true,

      audioFormat: "mp3",

      audioQuality: bitrate,

      ffmpegLocation: "/usr/bin/ffmpeg",

      noWarnings: true,

      noCheckCertificates: true

    });

    return {

      success: true,

      fileName,

      filePath: outputPath,

      fileUrl: `/downloads/${fileName}`,

      title: info.title,

      thumbnail: info.thumbnail,

      duration: info.duration,

      platform: detectPlatform(url)

    };

  } catch (error) {

    return {

      success: false,

      message: error.message

    };

  }

};

module.exports = {

  fetchMetadata,

  downloadVideo,

  downloadAudio,

  detectPlatform

};