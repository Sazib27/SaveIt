const path = require("path");

const fs = require("fs");

const ffmpeg = require("./ffmpeg");

const tempDir =
  path.join(__dirname, "../temp");

if (!fs.existsSync(tempDir)) {

  fs.mkdirSync(tempDir, {
    recursive: true
  });

}

const convertToMp3 = (
  inputPath,
  outputName
) => {

  return new Promise((resolve, reject) => {

    const outputPath =
      path.join(
        tempDir,
        `${outputName}.mp3`
      );

    ffmpeg(inputPath)

      .audioBitrate(192)

      .toFormat("mp3")

      .on("end", () => {

        resolve({
          success: true,
          outputPath
        });

      })

      .on("error", (error) => {

        reject({
          success: false,
          message: error.message
        });

      })

      .save(outputPath);

  });

};

const convertVideoQuality = (
  inputPath,
  outputName,
  resolution
) => {

  return new Promise((resolve, reject) => {

    const outputPath =
      path.join(
        tempDir,
        `${outputName}_${resolution}.mp4`
      );

    ffmpeg(inputPath)

      .videoCodec("libx264")

      .size(`?x${resolution}`)

      .outputOptions([
        "-preset fast",
        "-crf 28"
      ])

      .on("end", () => {

        resolve({
          success: true,
          outputPath
        });

      })

      .on("error", (error) => {

        reject({
          success: false,
          message: error.message
        });

      })

      .save(outputPath);

  });

};

const generateThumbnail = (
  inputPath,
  outputName
) => {

  return new Promise((resolve, reject) => {

    const outputPath =
      path.join(
        tempDir,
        `${outputName}.jpg`
      );

    ffmpeg(inputPath)

      .screenshots({

        timestamps: ["10%"],

        filename:
          `${outputName}.jpg`,

        folder: tempDir,

        size: "1280x720"

      })

      .on("end", () => {

        resolve({
          success: true,
          outputPath
        });

      })

      .on("error", (error) => {

        reject({
          success: false,
          message: error.message
        });

      });

  });

};

const compressVideo = (
  inputPath,
  outputName
) => {

  return new Promise((resolve, reject) => {

    const outputPath =
      path.join(
        tempDir,
        `${outputName}_compressed.mp4`
      );

    ffmpeg(inputPath)

      .videoCodec("libx264")

      .audioCodec("aac")

      .outputOptions([
        "-crf 30",
        "-preset medium"
      ])

      .on("end", () => {

        resolve({
          success: true,
          outputPath
        });

      })

      .on("error", (error) => {

        reject({
          success: false,
          message: error.message
        });

      })

      .save(outputPath);

  });

};

const mergeAudioVideo = (
  videoPath,
  audioPath,
  outputName
) => {

  return new Promise((resolve, reject) => {

    const outputPath =
      path.join(
        tempDir,
        `${outputName}_merged.mp4`
      );

    ffmpeg()

      .input(videoPath)

      .input(audioPath)

      .videoCodec("copy")

      .audioCodec("aac")

      .on("end", () => {

        resolve({
          success: true,
          outputPath
        });

      })

      .on("error", (error) => {

        reject({
          success: false,
          message: error.message
        });

      })

      .save(outputPath);

  });

};

const getMediaInfo = (
  inputPath
) => {

  return new Promise((resolve, reject) => {

    ffmpeg.ffprobe(
      inputPath,
      (error, metadata) => {

        if (error) {

          reject({
            success: false,
            message: error.message
          });

        } else {

          resolve({
            success: true,
            metadata
          });

        }

      }
    );

  });

};

module.exports = {

  convertToMp3,

  convertVideoQuality,

  generateThumbnail,

  compressVideo,

  mergeAudioVideo,

  getMediaInfo

};