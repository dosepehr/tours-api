const yup = require('yup');

const tourSchema = yup.object().shape({
    name: yup
        .string()
        .required(
            'The tour must have a name. Please provide a name for the tour.',
        )
        .trim()
        .min(10, 'The name must be at least 10 characters long.')
        .max(50, 'The name can be at most 50 characters long.'),

    duration: yup
        .number()
        .required(
            'The tour must have a duration. Please provide the duration in days.',
        )
        .positive('Duration must be a positive number.'),

    maxGroupSize: yup
        .number()
        .required(
            'The tour must have a group size. Please provide the maximum group size.',
        )
        .positive('Group size must be a positive number.'),

    difficulty: yup
        .string()
        .required(
            'The tour must have a difficulty level. Please choose one from easy, medium, or difficult.',
        )
        .oneOf(
            ['easy', 'medium', 'difficult'],
            'Difficulty must be one of the following: easy, medium, or difficult.',
        ),

    ratingsAverage: yup
        .number()
        .default(4.5)
        .min(1, 'The average rating must be at least 1.')
        .max(5, 'The average rating can be at most 5.'),

    ratingsQuantity: yup
        .number()
        .default(0)
        .integer('Ratings quantity must be an integer.'),

    price: yup
        .number()
        .required(
            'The tour must have a price. Please provide the price for the tour.',
        )
        .positive('Price must be a positive number.'),

    priceDiscount: yup
        .number()
        .test(
            'is-less-than-price',
            'Discount price must be less than the original price.',
            function (val) {
                return val === undefined || val < this.parent.price;
            },
        ),

    summary: yup
        .string()
        .trim()
        .required(
            'The tour must have a summary. Please provide a brief description of the tour.',
        ),

    description: yup.string().trim(),

    cover: yup
        .string()
        .required(
            'The tour must have a cover image. Please provide the URL of the cover image.',
        ),

    images: yup.array().of(yup.string().url('Each image must be a valid URL.')),

    startDates: yup
        .array()
        .of(yup.date().typeError('Start dates must be valid dates.')),

    secretTour: yup.boolean().default(false),
});

module.exports = tourSchema;
