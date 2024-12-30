const expressAsyncHandler = require('express-async-handler');
const sharp = require('sharp');

exports.resizePhoto = expressAsyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.png`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('png')
        .png({
            quality: 90,
        })
        .toFile(`public/uploads/${req.file.filename}`);
    next();
});
exports.resizePhotos = expressAsyncHandler(async (req, res, next) => {
    if (!req.files) return next();

    req.body.images = [];
    // can use Promise.all too
    req.files.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.png`;
        req.body.images.push(filename);
        await sharp(file.buffer)
            .resize(500, 500)
            .toFormat('png')
            .png({
                quality: 90,
            })
            .toFile(`public/uploads/${filename}`);
    }),
        next();
});
