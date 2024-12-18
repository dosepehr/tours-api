const express = require('express');
const { customError } = require('./errorController');

const errorRouter = express.Router();

errorRouter.all('/custom', customError);
module.exports = errorRouter;
