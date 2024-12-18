const sendRes = require('../../utils/sendRes');

const deleteErrors = (obj) => {
    if (obj.errors.length == 0) {
        delete obj['errors'];
    }
    return obj;
};
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    sendRes(
        res,
        statusCode,
        deleteErrors({
            status: err.status || false,
            message: message,
            errors: err.errors || [],
        }),
    );
    next();
};
