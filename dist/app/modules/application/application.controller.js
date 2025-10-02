"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("./application.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createApplication = (0, catchAsync_1.default)(async (req, res) => {
    const ApplicationData = req.body;
    const result = await application_service_1.ApplicationServices.createApplication(req.user, ApplicationData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Application created successfully',
        data: result,
    });
});
const updateApplication = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const ApplicationData = req.body;
    const result = await application_service_1.ApplicationServices.updateApplication(id, ApplicationData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Application updated successfully',
        data: result,
    });
});
const getSingleApplication = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await application_service_1.ApplicationServices.getSingleApplication(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Application retrieved successfully',
        data: result,
    });
});
const getAllApplications = (0, catchAsync_1.default)(async (req, res) => {
    const result = await application_service_1.ApplicationServices.getAllApplications(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Applications retrieved successfully',
        data: result,
    });
});
const deleteApplication = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await application_service_1.ApplicationServices.deleteApplication(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Application deleted successfully',
        data: result,
    });
});
exports.ApplicationController = {
    createApplication,
    updateApplication,
    getSingleApplication,
    getAllApplications,
    deleteApplication,
};
