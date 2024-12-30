const sendRes = require('../../utils/sendRes');
const Tour = require('./tourModel');
const asyncHandler = require('express-async-handler');
const tourValidation = require('./tourValidation');
const {
    deleteOne,
    addOne,
    updateOne,
    getOne,
    getAll,
} = require('../../utils/factory');

exports.topTours = asyncHandler(async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
});

exports.getTourStats = asyncHandler(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: {
                    $gte: 4.5,
                },
            },
        },
        {
            $group: {
                _id: null,
                // _id: '$difficulty',
                toursCount: {
                    $sum: 1,
                },
                numRatings: {
                    $sum: '$ratingsQuantity',
                },
                avgRating: {
                    $avg: '$ratingsAverage',
                },
                avgPrice: {
                    $avg: '$price',
                },
                minPrice: {
                    $min: '$price',
                },
                maxPrice: {
                    $max: '$price',
                },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
        {
            $match: { _id: { $ne: 'easy' } },
        },
    ]);
    sendRes(res, 200, {
        status: true,
        message: 'tour updated',
        data: stats,
    });
});

exports.getMonthlyPlan = asyncHandler(async (req, res, next) => {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                tourStartsCount: { $sum: 1 },
                tours: {
                    $push: '$name',
                },
            },
        },
        {
            $addFields: {
                month: '$_id',
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                tourStartsCount: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);
    sendRes(res, 200, {
        status: true,
        message: 'tour updated',
        data: plan,
    });
});

exports.getTours = getAll(Tour, {}, [
    {
        path: 'guides',
        select: '-__v -passwordChangedAt -createdAt -updatedAt -password',
    },
]);
exports.getTour = getOne(Tour, {}, [
    { path: 'guides', select: '-__v -createdAt -updatedAt' },
    // virtual populate
    { path: 'reviews' },
]);
exports.addTour = addOne(Tour, (data) =>
    tourValidation.validate(data, { context: { isUpdate: false } }),
);

exports.deleteTour = deleteOne(Tour);
exports.updateTour = updateOne(Tour, (data) =>
    tourValidation.validate(data, { context: { isUpdate: true } }),
);
