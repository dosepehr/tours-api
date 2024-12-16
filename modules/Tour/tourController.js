const APIFeatures = require('../../utils/APIFeatures');
const sendRes = require('../../utils/sendRes');
const Tour = require('./tourModel');

exports.topTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTours = async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();

    const tours = await features.query;
    sendRes(res, 200, {
        status: true,
        result: tours.length,
        data: {
            tours,
        },
    });
};

exports.getTour = async (req, res) => {
    const { id } = req.params;

    const tour = await Tour.findById(id);

    sendRes(res, 200, {
        status: true,
        data: {
            tour,
        },
    });
};

exports.addTour = async (req, res) => {
    await Tour.create(req.body);
    sendRes(res, 201, {
        status: true,
        message: 'tour created',
    });
};

exports.updateTour = async (req, res) => {
    const { id } = req.params;
    await Tour.findByIdAndUpdate(id, req.body);

    sendRes(res, 200, {
        status: true,
        message: 'tour updated',
    });
};

exports.deleteTour = async (req, res) => {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    sendRes(res, 204, {
        status: true,
        message: 'tour deleted',
    });
};

exports.getTourStats = async (req, res) => {
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
};
