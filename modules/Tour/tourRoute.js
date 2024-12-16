const express = require('express');
const {
    getTours,
    getTour,
    addTour,
    deleteTour,
    updateTour,
    topTours,
    getTourStats,
} = require('./tourController');

const tourRouter = express.Router();

tourRouter.route('/').get(getTours).post(addTour);
tourRouter.route('/top').get(topTours, getTours);
tourRouter.route('/stats').get(getTourStats);
tourRouter.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

module.exports = tourRouter;
