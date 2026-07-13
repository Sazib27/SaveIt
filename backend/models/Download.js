const ytDlp = require("yt-dlp-exec");
const path = require("path");
const fs = require("fs");

// ========================================
// Downloads Folder
// ========================================

const DOWNLOAD_DIR = path.join(__dirname, "..", "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}


// ========================================
// Detect Platform
// ========================================

function detectPlatform(url) {

    if (url.includes("youtu")) return "youtube";

    if (url.includes("instagram")) return "instagram";

    if (url.includes("facebook")) return "facebook";

    if (url.includes("tiktok")) return "tiktok";

    if (url.includes("twitter") || url.includes("x.com"))
        return "twitter";

    if (url.includes("pinterest"))
        return "pinterest";

    return "unknown";
}


// ========================================
// Safe File Name
// ========================================

function safeName(title) {

    return title
        .replace(/[<>:"/\\|?*]+/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 120);

}


// ========================================
// Fetch Metadata
// ========================================

async function fetchMetadata(url) {

    try {

        const info = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true
        });

        return {

            success: true,

            title: info.title,

            description: info.description,

            thumbnail: info.thumbnail,

            duration: info.duration,

            uploader: info.uploader,

            viewCount: info.view_count,

            platform: detectPlatform(url)

        };

    } catch (err) {

        return {

            success: false,

            message: err.message

        };

    }

}


// ========================================
// Download Video
// ========================================

async function downloadVideo(url, quality = "720") {

    try {

        const info = await ytDlp(url, {
            dumpSingleJson: true
        });

        const fileName =
            `${Date.now()}_${safeName(info.title)}.mp4`;

        const output =
            path.join(DOWNLOAD_DIR, fileName);

        let format = "best";

        if (quality === "1080")
            format = "bestvideo[height<=1080]+bestaudio/best";

        else if (quality === "720")
            format = "bestvideo[height<=720]+bestaudio/best";

        else if (quality === "480")
            format = "bestvideo[height<=480]+bestaudio/best";

        await ytDlp(url, {

            output,

            format,

            mergeOutputFormat: "mp4",

            noWarnings: true,

            noCheckCertificates: true

        });

        return {

            success: true,

            fileName,

            filePath: output,

            title: info.title,

            thumbnail: info.thumbnail,

            duration: info.duration,

            platform: detectPlatform(url)

        };

    } catch (err) {

        return {

            success: false,

            message: err.message

        };

    }

}


// ========================================
// Download Audio
// ========================================

async function downloadAudio(url) {

    try {

        const info = await ytDlp(url, {
            dumpSingleJson: true
        });

        const fileName =
            `${Date.now()}_${safeName(info.title)}.mp3`;

        const output =
            path.join(DOWNLOAD_DIR, fileName);

        await ytDlp(url, {

            output,

            extractAudio: true,

            audioFormat: "mp3",

            audioQuality: "192K",

            noWarnings: true,

            noCheckCertificates: true

        });

        return {

            success: true,

            fileName,

            filePath: output,

            title: info.title,

            thumbnail: info.thumbnail,

            duration: info.duration,

            platform: detectPlatform(url)

        };

    } catch (err) {

        return {

            success: false,

            message: err.message

        };

    }

}


module.exports = {

    fetchMetadata,

    downloadVideo,

    downloadAudio,

    detectPlatform

};