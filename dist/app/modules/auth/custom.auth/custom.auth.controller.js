"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAuthController = void 0;
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const custom_auth_service_1 = require("./custom.auth.service");
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../../config"));
const customLogin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...loginData } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.customLogin(loginData);
    const { status, message, accessToken, refreshToken, role } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: status,
        success: true,
        message: message,
        data: { accessToken, role },
    });
});
const adminLogin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...loginData } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.adminLogin(loginData);
    const { status, message, accessToken, refreshToken, role } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: status,
        success: true,
        message: message,
        data: { accessToken, refreshToken, role },
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email, phone } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.forgetPassword(email.toLowerCase().trim(), phone);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.query.token;
    const { ...resetData } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.resetPassword(token, resetData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Password reset successfully, please login now.',
        data: result,
    });
});
const verifyAccount = (0, catchAsync_1.default)(async (req, res) => {
    const { oneTimeCode, phone, email } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.verifyAccount(email, oneTimeCode);
    const { status, message, accessToken, refreshToken, role, token } = result;
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
        data: { accessToken, role, token },
    });
});
const getAccessToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await custom_auth_service_1.CustomAuthServices.getAccessToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Token refreshed successfully',
        data: result,
    });
});
const resendOtp = (0, catchAsync_1.default)(async (req, res) => {
    const { email, phone, authType } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.resendOtp(email, authType);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `An OTP has been sent to your ${email || phone}. Please verify your email.`,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.changePassword(req.user, currentPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Password changed successfully',
        data: result,
    });
});
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const { ...userData } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.createUser(userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});
const deleteAccount = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { password } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.deleteAccount(user, password);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Account deleted successfully',
        data: result,
    });
});
const socialLogin = (0, catchAsync_1.default)(async (req, res) => {
    const { appId, deviceToken } = req.body;
    const result = await custom_auth_service_1.CustomAuthServices.socialLogin(appId, deviceToken);
    const { status, message, accessToken, refreshToken, role } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: status,
        success: true,
        message: message,
        data: { accessToken, role },
    });
});
exports.CustomAuthController = {
    forgetPassword,
    resetPassword,
    verifyAccount,
    customLogin,
    getAccessToken,
    resendOtp,
    changePassword,
    createUser,
    deleteAccount,
    adminLogin,
    socialLogin,
};
