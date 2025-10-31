"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const newsletter_service_1 = require("./newsletter.service");
const http_status_codes_1 = require("http-status-codes");
const createNewsletter = (0, catchAsync_1.default)(async (req, res) => {
    const newsletterData = req.body;
    const result = await newsletter_service_1.newsletterService.createNewsletter(newsletterData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Newsletter created successfully',
        data: result,
    });
});
const getAllNewsletters = (0, catchAsync_1.default)(async (req, res) => {
    const result = await newsletter_service_1.newsletterService.getAllNewsletters();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Newsletters retrieved successfully',
        data: result,
    });
});
const deleteNewsletter = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await newsletter_service_1.newsletterService.deleteNewsletter(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Newsletter deleted successfully',
        data: result,
    });
});
const deleteAllNewsletters = (0, catchAsync_1.default)(async (req, res) => {
    const result = await newsletter_service_1.newsletterService.deleteAllNewsletters();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'All newsletters deleted successfully',
        data: result,
    });
});
exports.newsletterController = {
    createNewsletter,
    getAllNewsletters,
    deleteNewsletter,
    deleteAllNewsletters,
};
