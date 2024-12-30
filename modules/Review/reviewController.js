const expressAsyncHandler = require('express-async-handler');
const Review = require('./reviewModel');
const { deleteOne, getAll } = require('../../utils/factory');

exports.checkReviewBlongsToUser = expressAsyncHandler(
    async (req, res, next) => {
        const { reviewId } = req.params;

        // Fetch the review
        const selectedReview = await Review.findById(reviewId);

        // Check if the review exists
        if (!selectedReview) {
            return res.status(404).json({
                status: false,
                message: 'No review found',
            });
        }

        // Check if the review belongs to the user
        const isUserReview = selectedReview.user.toString() === req.user.id;
        if (!isUserReview) {
            return res.status(401).json({
                status: false,
                message: 'This review does not belong to you',
            });
        }
        req.selectedReview = selectedReview;
        next();
    },
);
exports.addReview = expressAsyncHandler(async (req, res, next) => {
    const { review, rating, tour } = req.body;
    const count = await Review.countDocuments({ tour, user: req.user.id });
    if (count) {
        return res.status(201).json({
            status: false,
            message: 'you already sent a review for this tour',
        });
    }
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
exports.getReviews = getAll(Review, {}, [
    {
        path: 'tour',
        select: 'name slug',
    },
    {
        path: 'user',
        select: 'name photo',
    },
]);
exports.changeReviewStatus = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    review.status = review.status ? 0 : 1;
    await review.save();
    res.status(201).json({
        status: true,
        message: `review ${review.status ? 'accepted' : 'rejected'}`,
    });
});
exports.deleteReview = deleteOne(Review);
exports.getReview = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id)
        .populate('tour', 'name slug')
        .populate('user', 'name photo');
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
            select: 'name slug',
        })
        .populate('user', 'name photo')
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
        .populate('tour', 'name slug')
        .populate('user', 'name photo');
    res.status(200).json({
        status: true,
        length: userReviews?.length || 0,
        reviews: userReviews,
    });
});

exports.updateReviewByUser = expressAsyncHandler(async (req, res, next) => {
    const selectedReview = req.selectedReview;
    const { review, rating } = req.body;

    // Update the review
    selectedReview.review = review;
    selectedReview.rating = rating;
    await selectedReview.save();

    // Respond with success
    res.status(200).json({
        status: true,
        message: 'Review updated successfully',
    });
});

exports.deleteReviewByUser = expressAsyncHandler(async (req, res, next) => {
    await Review.deleteOne({
        _id: req.params.reviewId,
    });
    res.status(200).json({
        status: true,
        message: 'Review deleted successfully',
    });
});
