const sendRes = require('../../funcs/sendRes');
const Tour = require('./tourModel');

exports.topTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTours = async (req, res) => {
    const queryObj = { ...req.query };

    // filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.map((el) => delete queryObj[el]);

    let query = Tour.find(queryObj);

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }
    // pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (+req.query.page) {
        const toursCount = await Tour.countDocuments();
        console.log({ skip, toursCount });
        if (skip + 1 >= toursCount)
            throw new Error('this page does not exists');
    }

    const tours = await Tour.find(query);
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
