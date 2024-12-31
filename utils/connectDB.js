const mongoose = require('mongoose');
const getEnv = require('./getEnv');

const DB_URI = getEnv('DB_URI');
mongoose
    .connect(DB_URI)
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.log('db connection error : ', err));
