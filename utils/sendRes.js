const sendRes = (res, status, json) => {
    return res.status(status).json(json);
};

module.exports = sendRes;
