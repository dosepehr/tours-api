const expressAsyncHandler = require('express-async-handler');
const User = require('./userModel');
const sendRes = require('../../utils/sendRes');
const userValidation = require('./userValidation');
const comparePassword = require('../../utils/comparePassword');
const hashPassword = require('../../utils/hashPassword');

exports.signup = expressAsyncHandler(async (req, res, next) => {
    await userValidation.validate(req.body);
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await User.create({
        ...req.body,
        ...{
            password: hashedPassword,
        },
    });
    sendRes(res, 201, {
        status: true,
        data: {
            user: newUser,
        },
    });
});
