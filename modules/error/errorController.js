const sendRes = require('../../utils/sendRes');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    sendRes(res, err.statusCode, {
        status: err.status,
        message: err.message,
    });
    next();
};
