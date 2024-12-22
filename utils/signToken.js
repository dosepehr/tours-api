const jwt = require('jsonwebtoken');
const getEnv = require('./getEnv');

const secretKey = getEnv('jwtSecretToken');
const expiresIn = getEnv('jwtExpire');

const signToken = (payload) => {
    const token = jwt.sign(payload, secretKey, {
        expiresIn,
    });
    return token;
};

module.exports = signToken;
