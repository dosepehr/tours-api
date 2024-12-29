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
exports.getReviews = expressAsyncHandler(async (req, res, next) => {
    const reviews = await Review.find()
    res.status(200).json({
        status: true,
        length: reviews?.length || 0,
        data: reviews,
    });
});
exports.changeReviewStatus = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    await Review.findByIdAndUpdate(id, {
        status: review.status ? 0 : 1,
    });
    res.status(201).json({
        status: true,
        message: `review ${review.status ? 'rejected' : 'accepted'}`,
    });
});
exports.deleteReview = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({
        status: true,
        message: 'review deleted successfully',
    });
});
exports.getReview = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id)
    res.status(200).json({
        status: true,
        review,
    });
});
exports.getReviewByTour = expressAsyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const { status = 1 } = req.query;

    const filteredReviews = await Review.find({
        status,
    })
        .populate({
            path: 'tour',
            match: { slug },
            select: '-__v -createdAt -updatedAt',
        })
        .populate('user', '-__v -createdAt -updatedAt')
        .lean();

    const reviews = filteredReviews.filter((review) => review.tour);

    res.status(200).json({
        status: true,
        length: reviews.length,
        reviews,
    });
});

exports.getReviewByUser = expressAsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { status = 1 } = req.query;
    const userReviews = await Review.find({ user: userId, status })
    res.status(200).json({
        status: true,
        length: userReviews?.length || 0,
        reviews: userReviews,
    });
});
