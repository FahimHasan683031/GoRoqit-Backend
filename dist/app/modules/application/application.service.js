"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationServices = exports.createApplication = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const application_model_1 = require("./application.model");
const mongoose_1 = __importStar(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const job_model_1 = require("../job/job.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const notifications_model_1 = require("../notifications/notifications.model");
const createApplication = async (user, payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const isExistUser = await user_model_1.User.findById(user.authId);
        if (!isExistUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
        }
        if (!isExistUser.profileCompletion || isExistUser.profileCompletion < 60) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please complete your profile first!');
        }
        const job = await job_model_1.Job.findById(payload.job);
        if (!job) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Job doesn't exist!");
        }
        if (user.role !== user_interface_1.USER_ROLES.APPLICANT) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only Applicants can apply for jobs');
        }
        const alreadyApplied = await application_model_1.Application.findOne({
            job: job._id,
            applicant: user.authId,
        });
        if (alreadyApplied) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You have already applied for this job');
        }
        const createdApplication = await application_model_1.Application.create([{ ...payload, applicant: user.authId, author: job.user }], { session });
        if (!createdApplication || createdApplication.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Application, please try again with valid data.');
        }
        const application = createdApplication[0];
        const updatedJob = await job_model_1.Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: 1 } }, { new: true, session });
        if (!updatedJob) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update job application count');
        }
        await notifications_model_1.Notification.create({
            to: job.user,
            from: user.authId,
            title: 'New Application Received',
            body: `A new application has been received for your job: ${job.title}`,
        }, { session });
        await session.commitTransaction();
        return application;
    }
    catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'Duplicate entry found');
        }
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.createApplication = createApplication;
const getAllApplications = async (user, query) => {
    if (user.role === user_interface_1.USER_ROLES.APPLICANT) {
        query.applicant = user.authId;
    }
    if (user.role === user_interface_1.USER_ROLES.RECRUITER) {
        query.author = user.authId;
    }
    console.log('query', query);
    const applicationQuery = new QueryBuilder_1.default(application_model_1.Application.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields()
        .populate([
        {
            path: 'job',
            select: 'title location',
        },
        {
            path: 'author',
            select: 'companyName',
        },
    ]);
    const applications = await applicationQuery.modelQuery;
    const paginationInfo = await applicationQuery.getPaginationInfo();
    return {
        data: applications,
        meta: paginationInfo,
    };
};
const getSingleApplication = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Application ID');
    }
    const result = await application_model_1.Application.findById(id).populate([
        'job',
        'applicant',
        'author',
    ]);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Requested Application not found, please try again with valid id');
    }
    return result;
};
const updateApplication = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Application ID');
    }
    const result = await application_model_1.Application.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { $set: payload }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Requested Application not found, please try again with valid id');
    }
    return result;
};
const deleteApplication = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Application ID');
    }
    const result = await application_model_1.Application.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Requested Application not found while deleting Application, please try again with valid id.');
    }
    return result;
};
exports.ApplicationServices = {
    createApplication: exports.createApplication,
    getAllApplications,
    getSingleApplication,
    updateApplication,
    deleteApplication,
};
