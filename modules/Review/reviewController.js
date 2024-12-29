const expressAsyncHandler = require('express-async-handler');

exports.addReview = expressAsyncHandler(async (req, res, next) => {});
exports.changeReviewStatus = expressAsyncHandler(async (req, res, next) => {});
exports.deleteReview = expressAsyncHandler(async (req, res, next) => {});
exports.getReviews = expressAsyncHandler(async (req, res, next) => {});
exports.getReview = expressAsyncHandler(async (req, res, next) => {});
exports.getReviewByTour = expressAsyncHandler(async (req, res, next) => {});
exports.getReviewByUser = expressAsyncHandler(async (req, res, next) => {});
