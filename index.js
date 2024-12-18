const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const getEnv = require('./utils/getEnv');
const sendRes = require('./utils/sendRes');
const tourRouter = require('./modules/Tour/tourRoute');
const globalErrorHandler = require('./modules/error/errorController');
const AppError = require('./utils/AppError');
//* database setup

require('./utils/connectDB');

//* express app
const app = express();
app.use(express.json());
app.use(morgan('dev'));

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
//* 404 route
app.all('*', async (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* error handling middleware
app.use(globalErrorHandler);

//* server setup
const port = getEnv('PORT');
app.listen(+port, () => {
    console.log(`Server is running on port ${port}`);
});
