const express = require('express');
const { signup, login } = require('./../Auth/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);

module.exports = userRouter;
