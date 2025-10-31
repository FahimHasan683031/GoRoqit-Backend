"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const job_service_1 = require("./job.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const pick_1 = __importDefault(require("../../../shared/pick"));
const job_constants_1 = require("./job.constants");
const pagination_1 = require("../../../interfaces/pagination");
const createJob = (0, catchAsync_1.default)(async (req, res) => {
    const jobData = req.body;
    const result = await job_service_1.JobServices.createJob(req.user, jobData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Job created successfully',
        data: result,
    });
});
const updateJob = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const jobData = req.body;
    const result = await job_service_1.JobServices.updateJob(id, jobData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Job updated successfully',
        data: result,
    });
});
const getSingleJob = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await job_service_1.JobServices.getSingleJob(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Job retrieved successfully',
        data: result,
    });
});
const getAllJobs = (0, catchAsync_1.default)(async (req, res) => {
    const filterables = (0, pick_1.default)(req.query, job_constants_1.jobFilterables);
    const pagination = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    console.log(filterables);
    const result = await job_service_1.JobServices.getAllJobs(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jobs retrieved successfully',
        data: result,
    });
});
const deleteJob = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await job_service_1.JobServices.deleteJob(req.user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Job deleted successfully',
        data: result,
    });
});
exports.JobController = {
    createJob,
    updateJob,
    getSingleJob,
    getAllJobs,
    deleteJob,
};
