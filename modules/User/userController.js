const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const sendRes = require('../../utils/sendRes');
const { loginUserSchema, signupUserSchema } = require('./userValidation');
const comparePassword = require('../../utils/comparePassword');
const verifyToken = require('../../utils/verifyToken');
const hashPassword = require('../../utils/hashPassword');
const signToken = require('../../utils/signToken');
const getBearerToken = require('../../utils/getBearerToken');
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
        status:true,
        token,
    });
});


