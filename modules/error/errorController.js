const getEnv = require('../../utils/getEnv');
const sendRes = require('../../utils/sendRes');
const asyncHandler = require('express-async-handler');
const AppError = require('../../utils/AppError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data`;
    return new AppError(message, 400, errors);
};

const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    const error = err || 'Internal Server Error';
    sendRes(res, statusCode, {
        status: false,
        error,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    if (err.isOperational) {
        sendRes(res, statusCode, {
            status: false,
            message: message,
            errors: err.errors,
        });
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
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        sendErrorProd(error, res);
    }
};

exports.customError = asyncHandler(async (req, res, next) => {
    throw new AppError('error', 300, ['error1', 'error2']);
});
