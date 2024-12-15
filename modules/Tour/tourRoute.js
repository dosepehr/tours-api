const express = require('express');

const tourRouter = express.Router();

tourRouter.route('/').get();

module.exports = tourRouter;
