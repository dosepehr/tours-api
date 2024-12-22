const jwt = require('jsonwebtoken');
const getEnv = require('./getEnv');

const secretKey = getEnv('jwtSecretToken');

const verifyToken = (token) => jwt.verify(token, secretKey);

module.exports = verifyToken;
