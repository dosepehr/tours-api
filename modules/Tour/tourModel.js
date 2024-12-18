const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: {
            type: Number,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description'],
        },
        description: {
            type: String,
            trim: true,
        },
        cover: {
            type: String,
            required: [true, 'A tour must have a cover'],
        },
        images: [String],
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);

// virtual properties => derived properties
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//* document middleware
// runs before .save() & .create()
tourSchema.pre('save', function (next) {
    // this => saved tour
    this.slug = slugify(this.name, { lower: true });
    next();
});

// runs affter .save() & .create()
tourSchema.post('save', function (doc, next) {
    // doc => saved tour
    next();
});

//* query middleware

tourSchema.pre('find', function (next) {
    // this points to current query not current document
    // this.find({ duration: 5 });
    this.username = 'sepehr';
    next();
});
tourSchema.post('find', function (res, next) {
    // console.log(this.username);
    next();
});
//* aggregation middleware

tourSchema.pre('aggregate', function (next) {
    // console.log(this);
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
