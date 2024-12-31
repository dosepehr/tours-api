const jwt = require('jsonwebtoken');
const getEnv = require('./getEnv');

const secretKey = getEnv('JWT_SECRET');
const expiresIn = getEnv('JWT_EXPIRES');

const signToken = (payload) => {
    const token = jwt.sign(payload, secretKey, {
        expiresIn,
    });
    return token;
};

module.exports = signToken;
