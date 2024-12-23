const express = require('express');
const { signup, login, getMe } = require('./../Auth/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/getMe').get(getMe);
module.exports = userRouter;
