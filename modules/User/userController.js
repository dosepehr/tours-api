const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const sendRes = require('../../utils/sendRes');
const userValidation = require('./userValidation');

exports.signup = expressAsyncHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);
    await userValidation.validate(req.body);
    sendRes(res, 201, {
        status: true,
        data: {
            user: newUser,
        },
    });
});