const expressAsyncHandler = require('express-async-handler');
const Review = require('./reviewModel');

exports.addReview = expressAsyncHandler(async (req, res, next) => {
    const { review, rating, tour } = req.body;
    const newReview = await Review.create({
        review,
        rating,
        user: req.user.id,
        tour,
    });
    res.status(201).json({
        status: true,
        data: newReview,
    });
});
exports.changeReviewStatus = expressAsyncHandler(async (req, res, next) => {});
exports.deleteReview = expressAsyncHandler(async (req, res, next) => {});
exports.getReviews = expressAsyncHandler(async (req, res, next) => {});
exports.getReview = expressAsyncHandler(async (req, res, next) => {});
exports.getReviewByTour = expressAsyncHandler(async (req, res, next) => {});
exports.getReviewByUser = expressAsyncHandler(async (req, res, next) => {});
