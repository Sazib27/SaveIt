const fs = require("fs");

const Download = require("../models/Download");

const {
    fetchMetadata,
    downloadVideo,
    downloadAudio
} = require("../utils/ytDownloader");


// ==========================================
// Fetch Media Information
// ==========================================

exports.fetchMedia = async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({

                success: false,

                message: "URL is required"

            });

        }

        const result = await fetchMetadata(url);

        return res.json(result);

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// Download Video / Audio
// ==========================================

exports.startDownload = async (req, res) => {

    try {

        console.log("==================================");
        console.log("START DOWNLOAD");
        console.log("==================================");

        const {

            url,

            type = "mp4",

            quality = "720"

        } = req.body;

        if (!url) {

            return res.status(400).json({

                success: false,

                message: "URL required"

            });

        }

        let result;

        if (type === "mp3") {

            console.log("Downloading Audio...");

            result = await downloadAudio(url);

        } else {

            console.log("Downloading Video...");

            result = await downloadVideo(

                url,

                quality

            );

        }

        console.log(result);

        if (!result.success) {

            return res.status(500).json(result);

        }

        if (!fs.existsSync(result.filePath)) {

            return res.status(500).json({

                success: false,

                message: "Downloaded file not found."

            });

        }

        const stats = fs.statSync(result.filePath);

        // Save history only if logged in
        const jwt = require("jsonwebtoken");

let userId = null;

const authHeader = req.headers.authorization;

if (
    authHeader &&
    authHeader.startsWith("Bearer ")
) {

    try {

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        userId = decoded.id;

    } catch (err) {

        console.log("Guest download.");

    }

}

await Download.create({

    user: userId,

    originalUrl: url,

    sourcePlatform: result.platform,

    mediaType: type === "mp3"
        ? "audio"
        : "video",

    title: result.title,

    thumbnail: result.thumbnail,

    duration: result.duration,

    quality: quality + "p",

    format: type,

    fileName: result.fileName,

    filePath: result.filePath,

    fileUrl: "/downloads/" + result.fileName,

    fileSize: stats.size,

    downloadStatus: "completed"

});

        console.log("Sending file to browser...");

        return res.download(

            result.filePath,

            result.fileName,

            (err) => {

                if (err) {

                    console.error(err);

                } else {

                    console.log("Download completed.");

                }

            }

        );

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// Download History
// ==========================================

exports.getSingleDownload = async (req, res) => {

    try {

        const download = await Download.findById(

            req.params.id

        );

        if (!download) {

            return res.status(404).json({

                success: false,

                message: "Download not found"

            });

        }

        return res.json({

            success: true,

            download

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// Delete History
// ==========================================

exports.deleteDownload = async (req, res) => {

    try {

        const download = await Download.findById(

            req.params.id

        );

        if (!download) {

            return res.status(404).json({

                success: false,

                message: "Download not found"

            });

        }

        if (

            req.user &&

            download.user &&

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

            fs.unlinkSync(download.filePath);

        }

        await download.deleteOne();

        return res.json({

            success: true,

            message: "Download deleted"

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};