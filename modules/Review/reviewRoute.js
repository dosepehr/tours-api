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
    updateReviewByUser,
    deleteReviewByUser,
    checkReviewBlongsToUser,
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

reviewRouter.route('/byUser/:userId').get(getReviewByUser);

reviewRouter
    .route('/editReview/:reviewId')
    .put(protect, checkReviewBlongsToUser, updateReviewByUser);
reviewRouter
    .route('/deleteReview/:reviewId')
    .delete(protect, checkReviewBlongsToUser, deleteReviewByUser);

reviewRouter.route('/byTour/:slug').get(getReviewByTour);

module.exports = reviewRouter;
