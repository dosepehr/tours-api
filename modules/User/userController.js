const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const AppError = require('../../utils/AppError');
const { editUserSchema } = require('./userValidation');
exports.editUserData = expressAsyncHandler(async (req, res, next) => {
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
        },
        { new: true }, // This ensures the updated user is returned
    );
    res.status(200).json({
        status: true,
        data: updatedUser,
    });
});
