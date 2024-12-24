const express = require('express');
const {
    signup,
    login,
    getMe,
    resetPassword,
    forgotPassword,
    updatePassword,
    protect,
} = require('./../Auth/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').post(resetPassword);
userRouter.route('/getMe').get(getMe);
userRouter.route('/updatePassword').post(protect, updatePassword);
module.exports = userRouter;
