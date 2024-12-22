const mongoose = require('mongoose');
const getEnv = require('./getEnv');

const dbURI = getEnv('dbURI');
mongoose
    .connect(dbURI)
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.log('db connection error : ', err));
