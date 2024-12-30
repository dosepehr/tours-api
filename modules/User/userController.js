const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const AppError = require('../../utils/AppError');
const { editUserSchema } = require('./userValidation');

exports.updateMe = expressAsyncHandler(async (req, res, next) => {
    // get user from token
    const userId = req?.user?.id;
    if (!userId) {
        return next(new AppError('no user found', 401));
    }
    await editUserSchema.validate(req.body);
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            name: req.body.name,
            email: req.body.email,
            photo: req?.file?.filename,
        },
        { new: true }, // This ensures the updated user is returned
    );
    res.status(200).json({
        status: true,
        data: updatedUser,
    });
});

exports.deleteMe = expressAsyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: true,
        data: null,
    });
});

exports.getUsers = expressAsyncHandler(async (req, res, next) => {
    const users = await User.find({ active: { $ne: false } });
    res.status(200).json({
        status: true,
        data: users,
    });
});
