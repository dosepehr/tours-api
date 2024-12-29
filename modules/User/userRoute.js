const express = require('express');
const {
    signup,
    login,
    getMe,
    resetPassword,
    forgotPassword,
    updatePassword,
    protect,
    restrictTo,
} = require('./../Auth/authController');
const { updateMe, deleteMe, getUsers } = require('./userController');
const userRouter = express.Router();

userRouter.route('/').get(protect, restrictTo('admin'), getUsers);
userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:token').post(resetPassword);
userRouter.route('/getMe').get(protect, getMe);
userRouter.route('/updatePassword').patch(protect, updatePassword);
userRouter.route('/updateMe').patch(protect, updateMe);
userRouter.route('/deleteMe').patch(protect, deleteMe);
module.exports = userRouter;
