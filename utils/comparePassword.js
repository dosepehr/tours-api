const bcrypt = require('bcrypt');

const comparePassword = async (plainPassword, hash) => {
    const match = await bcrypt.compare(plainPassword, hash);
    return match;
};

module.exports = comparePassword;
