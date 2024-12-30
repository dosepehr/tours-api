const yup = require('yup');

const tourValidation = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(10, 'The name must be at least 10 characters long.')
        .max(50, 'The name can be at most 50 characters long.')
        .when('$isUpdate', {
            is: false, // For add
            then: yup.string().required('The tour must have a name.'),
        }),
    duration: yup
        .number()
        .positive('Duration must be a positive number.')
        .when('$isUpdate', {
            is: false,
            then: yup.number().required('The tour must have a duration.'),
        }),
    maxGroupSize: yup
        .number()
        .positive('Group size must be a positive number.')
        .when('$isUpdate', {
            is: false,
            then: yup.number().required('The tour must have a group size.'),
        }),
    difficulty: yup
        .string()
        .oneOf(
            ['easy', 'medium', 'difficult'],
            'Difficulty must be one of the following: easy, medium, or difficult.',
        )
        .when('$isUpdate', {
            is: false,
            then: yup
                .string()
                .required('The tour must have a difficulty level.'),
        }),
    ratingsAverage: yup
        .number()
        .min(1, 'The average rating must be at least 1.')
        .max(5, 'The average rating can be at most 5.'),
    ratingsQuantity: yup
        .number()
        .integer('Ratings quantity must be an integer.'),
    price: yup
        .number()
        .positive('Price must be a positive number.')
        .when('$isUpdate', {
            is: false,
            then: yup.number().required('The tour must have a price.'),
        }),
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
        .when('$isUpdate', {
            is: false,
            then: yup.string().required('The tour must have a summary.'),
        }),
    description: yup.string().trim(),
    cover: yup.string().when('$isUpdate', {
        is: false,
        then: yup.string().required('The tour must have a cover image.'),
    }),
    images: yup.array().of(yup.string()),
    startDates: yup
        .array()
        .of(yup.date().typeError('Start dates must be valid dates.')),
    secretTour: yup.boolean(),
});

module.exports = tourValidation;
