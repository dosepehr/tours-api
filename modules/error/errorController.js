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

const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    sendRes(
        res,
        statusCode,
        deleteErrors({
            status: false,
            message: message,
            errors: err.errors || [],
            stack: err.stack,
        }),
    );
};

const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.isOperational) {
        sendRes(
            res,
            statusCode,
            deleteErrors({
                status: false,
                message: message,
                errors: err.errors || [],
                stack: err.stack,
            }),
        );
        // programming or other unknown error: don't leak error details
    } else {
        console.log('ERROR 💥', err);
        sendRes(res, 500, {
            status: false,
            message: 'something went wrong',
        });
    }
};
exports.globalErrorHandler = (err, req, res, next) => {
    const NODE_ENV = getEnv('NODE_ENV');

    if (NODE_ENV == 'dev') {
        sendErrorDev(err, res);
    } else if (NODE_ENV == 'prod') {
        sendErrorProd(err, res);
    }
};

exports.customError = asyncHandler(async (req, res, next) => {
    throw new AppError('error', 300, ['error1', 'error2']);
});
