const process = require('process');
process.on('uncaughtException', (err) => {
    console.log('uncaughtException 💥 shutting down');
    console.log(err);
    process.exit(1);
});

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const getEnv = require('./utils/getEnv');
const sendRes = require('./utils/sendRes');
const tourRouter = require('./modules/Tour/tourRoute');
const errorRouter = require('./modules/Error/errorRoute');
const { globalErrorHandler } = require('./modules/Error/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./modules/User/userRoute');

const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in an hour',
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
//* database setup

require('./utils/connectDB');

//* express app
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', limiter);

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., Postman or server-to-server requests)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback('Not allowed by CORS');
        }
    },
};

app.use(cors(corsOptions));

//* routes
app.route('/').all((_, res) => {
    sendRes(res, 200, {
        status: true,
        message: 'welcome home:)',
    });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/errors', errorRouter);
app.use('/api/v1/users', userRouter);
//* 404 route
app.all('*', async (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* error handling middleware
app.use(globalErrorHandler);

//* server setup
const port = getEnv('PORT');
const server = app.listen(+port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection 💥 shutting down');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
