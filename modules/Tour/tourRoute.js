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
const uploader = require('../../utils/fileUploader');
const { resizePhotos } = require('../../utils/resizePhoto');

const tourRouter = express.Router();

tourRouter.route('/').get(protect, getTours).post(addTour);
tourRouter.route('/top').get(topTours, getTours);
tourRouter.route('/stats').get(getTourStats);
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
tourRouter
    .route('/:id')
    .get(getTour)
    .put(
        uploader(['.png'], 3 * 1000 * 1000).array('images', 2),
        resizePhotos,
        updateTour,
    )
    .delete(protect, restrictTo('admin'), deleteTour);

module.exports = tourRouter;
