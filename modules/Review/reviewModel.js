const mongoose = require('mongoose');
const Tour = require('../Tour/tourModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        status: {
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);
// use this to populate all find routes
// reviewSchema.pre(/^find/, function (next) {
//     this.populate('tour', 'name slug').populate('user', 'name photo');
//     this.populate('user', 'name photo');
//     next();
// });

reviewSchema.statics.calcAvgRatings = async function (tourId) {
    // this => current Model => Review
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId,
                status: 1,
            },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: +stats[0].avgRating.toFixed(2),
    });
};

reviewSchema.post('save', function () {
    // this points to current review
    // this.constructor => current Model => Review
    this.constructor.calcAvgRatings(this.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
