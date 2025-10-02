"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const job_model_1 = require("./job.model");
const job_constants_1 = require("./job.constants");
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const category_model_1 = require("../category/category.model");
const application_model_1 = require("../application/application.model");
const createJob = async (user, payload) => {
    try {
        const checkCategory = await category_model_1.Category.findOne({ name: payload.category });
        if (!checkCategory) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category not found, please try again with valid category name.');
        }
        const result = await job_model_1.Job.create({ ...payload, user: user.authId });
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Job, please try again with valid data.');
        }
        return result;
    }
    catch (error) {
        if (error.code === 11000) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate entry found');
        }
        throw error;
    }
};
const getAllJobs = async (query) => {
    const jobQueryBuilder = new QueryBuilder_1.default(job_model_1.Job.find(), query)
        .filter()
        .search(job_constants_1.jobSearchableFields)
        .sort()
        .fields()
        .paginate()
        .populate([
        {
            path: 'user',
            select: 'email name role image status verified profile roleProfile',
            populate: {
                path: 'profile',
                model: 'RecruiterProfile',
                select: 'companyName companyLogo',
            },
        },
    ]);
    const totalApplications = await application_model_1.Application.countDocuments();
    const jobs = await jobQueryBuilder.modelQuery;
    const paginationInfo = await jobQueryBuilder.getPaginationInfo();
    return {
        data: jobs,
        meta: { ...paginationInfo, totalApplications },
    };
};
const getSingleJob = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Job ID');
    }
    const result = await job_model_1.Job.findById(id).populate([
        {
            path: 'user',
            select: 'email name role image status verified profile roleProfile',
            populate: {
                path: 'profile',
                model: 'RecruiterProfile'
            },
        },
    ]);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Requested job not found, please try again with valid id');
    }
    return result;
};
const updateJob = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Job ID');
    }
    const result = await job_model_1.Job.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { $set: payload }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Requested job not found, please try again with valid id');
    }
    return result;
};
const deleteJob = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Job ID');
    }
    const result = await job_model_1.Job.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Something went wrong while deleting job, please try again with valid id.');
    }
    return result;
};
exports.JobServices = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob,
};
