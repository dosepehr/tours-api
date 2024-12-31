const getEnv = require('../../utils/getEnv');
const sendRes = require('../../utils/sendRes');
const AppError = require('../../utils/AppError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400, [`This ${err.path} is not correct`]);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const validatorError = err.errors;
    const dbError = Object.values(err.errors).map((el) => el.message);

    const errors = Array.isArray(validatorError) ? validatorError : dbError;
    const message = `Invalid input data`;
    return new AppError(message, 400, errors);
};

const handleJWTError = () => new AppError('Invalid token', 401);
const handleTokenExpiredError = () =>
    new AppError('your token has been expired', 401);
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
            message,
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
        let error = { ...err, message: err.message, name: err.name };
        console.log(error.message);
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name == 'JsonWebTokenError') error = handleJWTError();
        if (error.name == 'TokenExpiredError') error = handleTokenExpiredError();
        sendErrorProd(error, res);
    }
};
