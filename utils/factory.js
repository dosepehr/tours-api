const expressAsyncHandler = require('express-async-handler');
const AppError = require('./AppError');
const APIFeatures = require('./APIFeatures');

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
        // if (validate) {
        //     await validate(req.body);
        // }
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

exports.getAll = (Model, condition = {}, populateOptions = []) => {
    return expressAsyncHandler(async (req, res, next) => {
        // Build the base query using the APIFeatures class
        let features = new APIFeatures(Model.find(condition), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();

        // Apply population to the final query
        let query = features.query;
        if (populateOptions.length) {
            populateOptions.forEach((pop) => {
                query = query.populate(pop);
            });
        }

        // Execute the populated query
        const data = await query

        res.status(200).json({
            status: true,
            length: data?.length || 0,
            data,
        });
    });
};

exports.getOne = (Model, condition = {}, populateOptions = []) => {
    return expressAsyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const filter = id ? { _id: id } : condition;

        // Build the query
        let query = Model.findOne(filter);

        // Apply population if provided
        if (populateOptions.length) {
            populateOptions.forEach((pop) => {
                query = query.populate(pop);
            });
        }

        const data = await query;

        if (!data) {
            return res.status(404).json({
                status: false,
                message: 'Resource not found',
            });
        }

        res.status(200).json({
            status: true,
            data,
        });
    });
};

// TODO : edit reading routes
// TODO fix tour validation routes
