const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const getEnv = require('./funcs/getEnv');
const sendRes = require('./funcs/sendRes');
const tourRouter = require('./modules/Tour/tourRoute');

//* database setup

require('./funcs/connectDB');

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
        message: 'index route',
    });
});

app.use('/api/v1/tours',tourRouter)

//* server setup
const port = getEnv('PORT');
app.listen(+port, () => {
    console.log(`Server is running on port ${port}`);
});
