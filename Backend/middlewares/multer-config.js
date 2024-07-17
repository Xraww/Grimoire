const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error("Invalid file type"), false);
        }
    }
}).single("image");

const compressImage = (buffer, outputFilePath) => {
    return sharp(buffer)
        .resize(206, 260)
        .jpeg({quality: 90})
        .toFile(outputFilePath)
        .catch(err => {
            console.error("Error during image compression:", err);
        });
};

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        if (req.file) {
            const originalName = req.file.originalname.split(" ").join("_");
            const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf("."));
            const extension = MIME_TYPES[req.file.mimetype];
            const outputFilePath = path.resolve(__dirname, "../images", nameWithoutExtension + "_" + Date.now() + "." + extension);

            compressImage(req.file.buffer, outputFilePath).then(() => {
                req.file.path = outputFilePath;
                next();
            });
        } else {
            next();
        }
    });
};