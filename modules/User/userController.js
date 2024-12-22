const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const sendRes = require('../../utils/sendRes');
const userValidation = require('./userValidation');
const comparePassword = require('../../utils/comparePassword');
const hashPassword = require('../../utils/hashPassword');
const signToken = require('../../utils/signToken');

exports.signup = expressAsyncHandler(async (req, res, next) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    await userValidation.validate(userData);
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
