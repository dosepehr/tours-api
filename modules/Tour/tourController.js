const APIFeatures = require('../../utils/APIFeatures');
const sendRes = require('../../utils/sendRes');
const Tour = require('./tourModel');
const asyncHandler = require('express-async-handler');
const tourValidation = require('./tourValidation');
const { deleteOne } = require('../../utils/factory');

exports.topTours = asyncHandler(async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
});

exports.getTours = asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();

    const tours = await features.query.populate(
        'guides',
        '-__v -passwordChangedAt -createdAt -updatedAt -password',
    );
    sendRes(res, 200, {
        status: true,
        result: tours.length,
        data: {
            tours,
        },
    });
});

exports.getTour = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const tour = await Tour.findById(id)
        .populate('guides', '-__v -createdAt -updatedAt')

        // virtual populate
        .populate('reviews');

    sendRes(res, 200, {
        status: true,
        data: {
            tour,
        },
    });
});

exports.addTour = asyncHandler(async (req, res, next) => {
    // await tourValidation.validate(req.body, { context: { isUpdate: false } }); TODO edit this
    await Tour.create(req.body);
    sendRes(res, 201, {
        status: true,
        message: 'tour created',
    });
});

exports.updateTour = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // await tourValidation.validate(req.body, { context: { isUpdate: true } });

    await Tour.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });

    sendRes(res, 200, {
        status: true,
        message: 'tour updated',
    });
});

exports.deleteTour = deleteOne(Tour);
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
