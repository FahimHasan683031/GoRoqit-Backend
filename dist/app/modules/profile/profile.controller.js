"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const profile_service_1 = require("./profile.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
// Create Profile
const createProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { image, ...userData } = req.body;
    image && (userData.profile = image[0]);
    const result = await profile_service_1.profileServices.CreateOrUpdataeProfile(req.user, userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile created successfully',
        data: result,
    });
});
// Get all profile
const getAllProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await profile_service_1.profileServices.GetAllProfile();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
});
// Get Profile
const getProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await profile_service_1.profileServices.GetProfile(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
});
// Update Profile
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { image, ...userData } = req.body;
    image && (userData.image = image[0]);
    const result = await profile_service_1.profileServices.UpdateProfile({ authId: req.user.authId, ...userData });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile updated successfully',
        data: { result },
    });
});
exports.profileControllers = {
    createProfile,
    getProfile,
    updateProfile,
    getAllProfile,
};
