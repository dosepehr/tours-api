const expressAsyncHandler = require('express-async-handler');
const AppError = require('./AppError');

exports.deleteOne = (Model) => {
    return expressAsyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const doc = await Model.findByIdAndDelete(id);
        if (!doc) {
            return next(new AppError('no document found with this ID', 404));
        }
        res.status(204).json({
            status: true,
        });
    });
};

exports.addOne = (Model, validate) => {
    return expressAsyncHandler(async (req, res, next) => {
        if (validate) {
            await validate(req.body);
        }
        await Model.create(req.body);
        res.status(201).json({
            status: true,
            message: 'created',
        });
    });
};

exports.updateOne = (Model, validate) => {
    return expressAsyncHandler(async (req, res, next) => {
        const { id } = req.params;
        if (validate) {
            await validate(req.body);
        }
        await Model.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true,
        });

        res.status(200).json({
            status: true,
            message: 'updated',
        });
    });
};

exports.getAll = (Model) => {
    return expressAsyncHandler(async (req, res, next) => {
        const data = await Model.find();
        res.status(200).json({
            status: true,
            length: data?.length || 0,
            data,
        });
    });
};

exports.getOnebyId = (Model) => {
    return expressAsyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const data = await Model.findById(id)
            .populate('guides', '-__v -createdAt -updatedAt')

            // virtual populate
            .populate('reviews');
        res.status(200).json({
            status: true,
            data,
        });
    });
};



// TODO : edit reading routes
// TODO fix tour validation routes