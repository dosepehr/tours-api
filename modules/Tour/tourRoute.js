const express = require('express');
const { getTours } = require('./tourController');

const tourRouter = express.Router();

tourRouter.route('/').get(getTours);

module.exports = tourRouter;
