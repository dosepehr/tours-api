const multer = require('multer');
const path = require('path');
const AppError = require('./AppError');

const uploader = (validMimes, maxSize) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/uploads');
        },
        filename: (req, file, cb) => {
            const filename = Date.now() + Math.floor(Math.random() * 1000);
            const ext = path.extname(file.originalname);
            if (validMimes.includes(ext)) {
                cb(null, filename + ext);
            } else {
                cb(
                    new AppError(
                        `unvalid mime,please upload ${validMimes.join(',')}`,
                        400,
                    ),
                );
            }
        },
    });
    const upload = multer({
        storage,
        limits: {
            fileSize: maxSize,
        },
    });
    return upload;
};

module.exports = uploader;
