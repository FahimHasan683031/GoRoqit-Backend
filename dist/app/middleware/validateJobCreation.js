"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJobCreation = void 0;
const job_model_1 = require("../modules/job/job.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../modules/user/user.model");
const validateJobCreation = async (req, res, next) => {
    var _a;
    try {
        //Check user exists and is recruiter
        const user = await user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.authId);
        if (!user || user.role !== 'recruiter') {
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Access denied. Only recruiters can create jobs."));
        }
        //Check subscription status
        if (user.subscribe) {
            return next();
        }
        //For non-subscribed recruiters
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentJob = await job_model_1.Job.findOne({
            user: user._id,
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 });
        if (recentJob) {
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, 'Job creation limited. Please subscribe to create more jobs.'));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateJobCreation = validateJobCreation;
