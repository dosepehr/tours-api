const expressAsyncHandler = require('express-async-handler');
const sharp = require('sharp');

exports.resizePhoto = expressAsyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.png`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('png')
        .png({
            quality: 90,
        })
        .toFile(`public/uploads/${req.file.filename}`);
    next();
});
