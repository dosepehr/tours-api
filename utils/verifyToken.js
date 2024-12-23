const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const getEnv = require('./getEnv');

const secretKey = getEnv('jwtSecretToken');

const verifyToken = async (token) =>
    await promisify(jwt.verify)(token, secretKey);

module.exports = verifyToken;
