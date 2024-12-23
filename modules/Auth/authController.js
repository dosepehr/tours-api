const expressAsyncHandler = require('express-async-handler');
const User = require('./../User/userModel');
const sendRes = require('../../utils/sendRes');
const {
    loginUserSchema,
    signupUserSchema,
} = require('./../User/userValidation');
const comparePassword = require('../../utils/comparePassword');
const hashPassword = require('../../utils/hashPassword');
const signToken = require('../../utils/signToken');
const AppError = require('../../utils/AppError');
const verifyToken = require('../../utils/verifyToken');

exports.signup = expressAsyncHandler(async (req, res, next) => {
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
    sendRes(res, 201, {
        status: true,
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    await loginUserSchema.validate({ email, password });

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
    sendRes(res, 200, {
        status: true,
        token,
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
