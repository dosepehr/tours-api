const multer = require('multer');
const path = require('path');
const AppError = require('./AppError');

const uploader = (validMimes, maxSize) => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        limits: {
            fileSize: maxSize,
        },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if (validMimes.includes(ext)) {
                cb(null, true);
            } else {
                cb(
                    new AppError(
                        `Invalid mime type. Please upload ${validMimes.join(',')}`,
                        400,
                    ),
                );
            }
        },
    });
    return upload;
};

module.exports = uploader;
