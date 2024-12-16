const sendRes = require('../../funcs/sendRes');
const Tour = require('./tourModel');

exports.getTours = async (req, res) => {
    const queryObj = { ...req.query };


    // filtering
    const excludedFields = ['page', 'sort', 'limits', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);
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
