const mongoose = require('mongoose');

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
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
