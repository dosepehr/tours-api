const express = require('express');
const {
    getTours,
    getTour,
    addTour,
    deleteTour,
    updateTour,
    topTours,
    getTourStats,
    getMonthlyPlan,
} = require('./tourController');
const { protect, restrictTo } = require('../Auth/authController');

const tourRouter = express.Router();

tourRouter.route('/').get(protect, getTours).post(addTour);
tourRouter.route('/top').get(topTours, getTours);
tourRouter.route('/stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter
    .route('/:id')
    .get(getTour)
    .put(updateTour)
    .delete(protect, restrictTo('admin'), deleteTour);

module.exports = tourRouter;
