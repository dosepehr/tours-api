const express = require('express');
const { protect, restrictTo } = require('../Auth/authController');
const {
    addReview,
    getReviews,
    changeReviewStatus,
    deleteReview,
    getReview,
    getReviewByTour,
    getReviewByUser,
} = require('./reviewController');

const reviewRouter = express.Router();

reviewRouter
    .route('/')
    .post(protect, restrictTo('user'), addReview)
    .get(getReviews);

reviewRouter
    .route('/:id')
    .put(protect, restrictTo('admin'), changeReviewStatus)
    .delete(protect, restrictTo('admin'), deleteReview)
    .get(getReview);

reviewRouter
    .route('/user/:userId')
    .get(getReviewByUser);

reviewRouter.route('/tour/:slug').get(getReviewByTour);

module.exports = reviewRouter;
