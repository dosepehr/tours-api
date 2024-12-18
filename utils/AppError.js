class AppError extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.status = false;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
