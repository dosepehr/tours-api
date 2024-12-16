const process = require('process');
require('dotenv').config();

const getEnv = (env) => process.env[env];

module.exports = getEnv;
