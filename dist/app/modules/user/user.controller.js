"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../../config"));
// Update Profile
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.updateProfile(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile updated successfully',
        data: { result },
    });
});
const getAllUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUser(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User fetched successfully',
        data: { ...result },
    });
});
// get single user
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getSingleUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
});
// update userRole
const updateUserRoleAndCreateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { role, ...profileData } = req.body;
    const result = await user_service_1.UserServices.updateUserRoleAndCreateProfile(req.params.id, role, profileData);
    const { status, message, accessToken, refreshToken, role: Role, token } = result;
    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            secure: config_1.default.node_env === 'production',
            httpOnly: true,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: status,
        success: true,
        message: message,
        data: { accessToken, refreshToken, Role, token },
    });
});
// delete user
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.deleteUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});
// get profile
const getProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getProfile(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile fetched successfully',
        data: result,
    });
});
// add applicant portfolio
const addApplicantPortfolio = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.addApplicantPortfolio(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Portfolio added successfully',
        data: result,
    });
});
// remove applicant portfolio
const removeApplicantPortfolio = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.removeApplicantPortfolio(req.user, req.params.title);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Portfolio removed successfully',
        data: result,
    });
});
// get applicants
const getApplicants = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getApplicants(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Applicants fetched successfully',
        data: result
    });
});
// get current user
const getCurrentUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getCurrentUser(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
});
// delete my account
const deleteMyAccount = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.deleteMyAccount(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result,
    });
});
exports.UserController = {
    getAllUser,
    updateProfile,
    getSingleUser,
    deleteUser,
    updateUserRoleAndCreateProfile,
    getProfile,
    getApplicants,
    getCurrentUser,
    deleteMyAccount,
    addApplicantPortfolio,
    removeApplicantPortfolio
};
