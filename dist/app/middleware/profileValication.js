"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileUpdate = void 0;
const user_interface_1 = require("../modules/user/user.interface");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const recruiterProfile_validation_1 = require("../modules/recruiterProfile/recruiterProfile.validation");
const applicantProfile_validation_1 = require("../modules/applicantProfile/applicantProfile.validation");
const validateRequest_1 = __importDefault(require("./validateRequest"));
const validateProfileUpdate = (req, res, next) => {
    var _a;
    try {
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!role) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User role missing in request");
        }
        if (role === user_interface_1.USER_ROLES.RECRUITER) {
            (0, validateRequest_1.default)(recruiterProfile_validation_1.RecruiterProfileUpdateSchema);
            // RecruiterProfileUpdateSchema.parseAsync(req.body)
        }
        else if (role === user_interface_1.USER_ROLES.APPLICANT) {
            applicantProfile_validation_1.ApplicantProfileUpdateSchema.parse(req.body);
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `Profile update not allowed for role: ${role}`);
        }
        next();
    }
    catch (error) {
        next(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Validation failed", error.errors || error.message));
    }
};
exports.validateProfileUpdate = validateProfileUpdate;
