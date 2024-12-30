const expressAsyncHandler = require('express-async-handler');
const User = require('./../User/userModel');
const sendRes = require('../../utils/sendRes');
const process = require('process');
const {
    loginUserSchema,
    signupUserSchema,
} = require('./../User/userValidation');
const comparePassword = require('../../utils/comparePassword');
const hashPassword = require('../../utils/hashPassword');
const signToken = require('../../utils/signToken');
const AppError = require('../../utils/AppError');
const verifyToken = require('../../utils/verifyToken');
const {
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema,
} = require('./authValidation');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');
exports.signup = expressAsyncHandler(async (req, res, next) => {
    const jwtExpire = +process.env.jwtExpire.slice(0, 2);
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    await signupUserSchema.validate(userData);
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await User.create({
        ...userData,
        ...{
            password: hashedPassword,
        },
    });
    const token = signToken({
        id: newUser._id,
    });
    res.cookie('auth', token, {
        expires: new Date(Date.now() + jwtExpire * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
    })
        .status(201)
        .json({
            status: true,
        });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    await loginUserSchema.validate({ email, password });
    const jwtExpire = +process.env.jwtExpire.slice(0, 2);

    const user = await User.findOne({ email });
    if (!user) {
        sendRes(res, 400, {
            status: false,
            message: 'invalid combination of email & password',
        });
    }

    const canLogin = await comparePassword(password, user.password);

    if (!canLogin) {
        sendRes(res, 400, {
            status: false,
            message: 'invalid combination of email & password',
        });
    }

    const token = signToken({
        id: user._id,
    });
    res.cookie('auth', token, {
        expires: new Date(Date.now() + jwtExpire * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
    })
        .status(200)
        .json({
            status: true,
        });
});

exports.protect = expressAsyncHandler(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    // 2) Verification token
    const decoded = await verifyToken(token);
    // 3) check if user exists
    const currentUser = await User.findById(decoded?.id);
    if (!currentUser) {
        return next(new AppError('Invalid token', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401,
            ),
        );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "you don't have permission to perform this action",
                    403,
                ),
            );
        }
        next();
    };
};

exports.getMe = expressAsyncHandler(async (req, res, next) => {
    const currentUser = await User.findById(req.id).select(
        '-password -passwordChangedAt -updatedAt -createdAt -_id -__v',
    );
    if (!currentUser) {
        return next(new AppError('Invalid token', 401));
    }
    sendRes(res, 200, {
        status: true,
        user: currentUser,
    });
});

exports.forgotPassword = expressAsyncHandler(async (req, res, next) => {
    // get user based on email
    await forgotPasswordSchema.validate({
        email: req.body.email,
    });
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('no user found with this email address', 404));
    }
    // generate random reset token
    const resetToken = user.createResetPasswordToken();
    await user.save({
        validateBeforeSave: false,
    });
    sendRes(res, 200, {
        resetToken,
    });
    // send back to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: 'Your password reset token (valid for 10 min)',
    //         message,
    //     });

    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Token sent to email!',
    //     });
    // } catch (err) {
    //     user.passwordResetToken = undefined;
    //     user.passwordResetExpires = undefined;
    //     await user.save({ validateBeforeSave: false });

    //     return next(
    //         new AppError(
    //             'There was an error sending the email. Try again later!',
    //         ),
    //         500,
    //     );
    // }
});
exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
    // get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now(),
        },
    });
    if (!user) {
        return next(new AppError('token is invalid or expired', 400));
    }

    // set the new password if token was valid
    await resetPasswordSchema.validate(req.body);
    user.password = await hashPassword(req.body.password);
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // update users changePasswordAt
    // log user in & send token
    const token = signToken({
        id: user._id,
    });
    res.status(200).json({
        status: true,
        message: 'your password changed successfully',
        token,
    });
});

exports.updatePassword = expressAsyncHandler(async (req, res, next) => {
    // get user from collection
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('no user found', 404));

    // compare user's password
    const currentPassword = req.body.currentPassword;
    const checkPasswords = await comparePassword(
        currentPassword,
        user.password,
    );
    if (!checkPasswords) {
        return next(new AppError('current password is not correct', 401));
    }

    // set user's new password
    await updatePasswordSchema.validate(req.body);
    user.password = await hashPassword(req.body.password);
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // log user in, send JWT
    const newToken = signToken({
        id: user._id,
    });
    res.status(200).json({
        status: true,
        message: 'your password changed successfully',
        token: newToken,
    });
});
