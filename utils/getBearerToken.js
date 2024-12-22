const AppError = require('./AppError');

const getBearerToken = (str) => {
    const splitedStr = str.split(' ');
    if (splitedStr[0] == 'Bearer') {
        return splitedStr[1];
    } else {
        throw new AppError('error', 300, ['error1', 'error2']);
    }
};

module.exports = getBearerToken;
