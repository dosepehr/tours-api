const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 10,
            maxLength: 50,
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: true,
        },
        maxGroupSize: {
            type: Number,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
            enum: {
                values: ['easy', 'medium', 'difficult'],
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: 1,
            max: 5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
        },
        priceDiscount: {
            type: Number,
        },
        summary: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: true,
        },
        images: [String],
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
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

// virtual populate
tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
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
tourSchema.pre(/^find/, function (next) {
    this.populate(
        'guides',
        '-__v -passwordChangedAt -createdAt -updatedAt -password',
    );
    next();
});

//* aggregation middleware

tourSchema.pre('aggregate', function (next) {
    // console.log(this);
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
