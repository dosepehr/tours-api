const sendRes = require('../../funcs/sendRes');
const Tour = require('./tourModel');

exports.getTours = async (req, res) => {
    const tours = await Tour.find();
    sendRes(res, 200, {
        status: true,
        result: tours.length,
        data: {
            tours,
        },
    });
};
