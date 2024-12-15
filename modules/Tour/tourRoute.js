const express = require('express');
const {
    getTours,
    getTour,
    addTour,
    deleteTour,
    updateTour,
} = require('./tourController');

const tourRouter = express.Router();

tourRouter.route('/').get(getTours).post(addTour);
tourRouter.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

module.exports = tourRouter;
