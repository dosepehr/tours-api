const getEnv = require('../../utils/getEnv');
const sendRes = require('../../utils/sendRes');
const asyncHandler = require('express-async-handler');
const AppError = require('../../utils/AppError');

const deleteErrors = (obj) => {
    if (obj.errors.length == 0) {
        delete obj['errors'];
    }
    return obj;
};
exports.globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const NODE_ENV = getEnv('NODE_ENV');
    if (NODE_ENV == 'dev') {
        sendRes(
            res,
            statusCode,
            deleteErrors({
                status: err.status || false,
                message: message,
                errors: err.errors || [],
                stack: err.stack,
            }),
        );
        next();
    }
};

exports.customError = asyncHandler(async (req, res, next) => {
    throw new AppError('error', 300, ['error1', 'error2']);
});
