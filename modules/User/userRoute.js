const express = require('express');
const { signup } = require('./userController');

const userRouter = express.Router();

userRouter.route('/signup').post(signup);

module.exports = userRouter;
