"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.updateProfile = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const user_1 = require("../../../enum/user");
const logger_1 = require("../../../shared/logger");
const profile_model_1 = require("../profile/profile.model");
const common_1 = require("../auth/common");
const auth_helper_1 = require("../auth/auth.helper");
const applicantProfile_model_1 = require("../applicantProfile/applicantProfile.model");
const recruiterProfile_model_1 = require("../recruiterProfile/recruiterProfile.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../../config"));
const createAdmin = async () => {
    const admin = {
        email: config_1.default.super_admin.email,
        name: config_1.default.super_admin.name,
        password: config_1.default.super_admin.password,
        role: user_1.USER_ROLES.ADMIN,
        status: user_1.USER_STATUS.ACTIVE,
        verified: true,
        authentication: {
            oneTimeCode: null,
            restrictionLeftAt: null,
            expiresAt: null,
            latestRequestAt: new Date(),
            authType: '',
        },
    };
    const isAdminExist = await user_model_1.User.findOne({
        email: admin.email,
        status: { $nin: [user_1.USER_STATUS.DELETED] },
    });
    if (isAdminExist) {
        logger_1.logger.log('info', 'Admin account already exist, skipping creation.');
        return isAdminExist;
    }
    const result = await user_model_1.User.create([admin]);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }
    logger_1.logger.log('info', 'Admin account created successfully.');
    return result[0];
};
const getAllUser = async (query) => {
    const userQueryBuilder = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const users = await userQueryBuilder.modelQuery.lean();
    const paginationInfo = await userQueryBuilder.getPaginationInfo();
    const totalUsers = await user_model_1.User.countDocuments();
    const totalRecruiters = await user_model_1.User.countDocuments({
        role: user_1.USER_ROLES.RECRUITER,
    });
    const totalApplicants = await user_model_1.User.countDocuments({
        role: user_1.USER_ROLES.APPLICANT,
    });
    const staticData = { totalUsers, totalRecruiters, totalApplicants };
    return {
        users,
        staticData,
        meta: paginationInfo,
    };
};
const getSingleUser = async (id) => {
    const result = await user_model_1.User.findById(id).populate('profile');
    return result;
};
// update userRole
const updateUserRoleAndCreateProfile = async (id, role, profileData) => {
    console.log('updateUserRoleAndCreateProfile', id, role, profileData);
    console.log('role', role);
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.role !== 'guest') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Role already updated');
    }
    const profile = await profile_model_1.Profile.create({
        userId: user._id,
        role,
        ...profileData,
    });
    const result = await user_model_1.User.findByIdAndUpdate(id, { role, profile: profile._id }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update user role and create profile');
    }
    const tokens = auth_helper_1.AuthHelper.createToken(result._id, result.role, result.name, result.email);
    return (0, common_1.authResponse)(http_status_codes_1.StatusCodes.OK, `Welcome ${result.name} to our platform.`, result.role, tokens.accessToken, tokens.refreshToken);
};
// delete User
const deleteUser = async (id) => {
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const result = await user_model_1.User.findByIdAndDelete(id);
    if (user.role === user_1.USER_ROLES.APPLICANT) {
        await applicantProfile_model_1.ApplicantProfile.findByIdAndDelete(user.profile);
    }
    else if (user.role === user_1.USER_ROLES.RECRUITER) {
        await recruiterProfile_model_1.RecruiterProfile.findByIdAndDelete(user.profile);
    }
    return result;
};
const updateProfile = async (user, payload) => {
    const isExistUser = await user_model_1.User.findById(user.authId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found or deleted.');
    }
    // 1. Update User basic fields (NO EMAIL update allowed)
    const updatedUser = await user_model_1.User.findOneAndUpdate({ _id: user.authId, status: { $ne: user_1.USER_STATUS.DELETED } }, {
        ...(payload.name && { name: payload.name }),
        ...(payload.firstName && { name: payload.firstName }),
        ...(payload.firstName &&
            payload.lastName && {
            name: payload.firstName + ' ' + payload.lastName,
        }),
        ...(payload.firstName &&
            payload.lastName &&
            payload.middleName && {
            name: payload.firstName +
                ' ' +
                payload.middleName +
                ' ' +
                payload.lastName,
        }),
        ...(payload.image && { image: payload.image }),
    }, { new: true });
    // 2. Update role-based profile
    if (isExistUser.role === user_1.USER_ROLES.APPLICANT && isExistUser.profile) {
        if (payload.openToWork && isExistUser.profileCompletion < 60) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please complete your profile first!');
        }
        const res = await applicantProfile_model_1.ApplicantProfile.findByIdAndUpdate(isExistUser.profile, payload, { new: true });
        // return "Profile updated successfully.";
        return res;
    }
    else if (isExistUser.role === user_1.USER_ROLES.RECRUITER && isExistUser.profile) {
        const res = await recruiterProfile_model_1.RecruiterProfile.findByIdAndUpdate(isExistUser.profile, payload, { new: true });
        // return "Profile updated successfully.";
        return res;
    }
    else {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Something went wrong.');
    }
};
exports.updateProfile = updateProfile;
const addApplicantPortfolio = async (user, portfolioData) => {
    var _a;
    const profile = await applicantProfile_model_1.ApplicantProfile.findOne({ userId: user.authId });
    if (!profile) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Applicant profile not found');
    }
    (_a = profile.portfolio) === null || _a === void 0 ? void 0 : _a.push(portfolioData);
    return await profile.save();
};
const removeApplicantPortfolio = async (user, title) => {
    var _a;
    const profile = await applicantProfile_model_1.ApplicantProfile.findOne({ userId: user.authId });
    if (!profile) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Applicant profile not found');
    }
    profile.portfolio = (_a = profile.portfolio) === null || _a === void 0 ? void 0 : _a.filter(item => item.title !== title);
    return await profile.save();
};
const getProfile = async (user) => {
    const isExistUser = await user_model_1.User.findById(user.authId)
        .populate('profile')
        .lean();
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The requested profile not found or deleted.');
    }
    return isExistUser;
};
const getCurrentUser = async (user) => {
    const isExistUser = await user_model_1.User.findById(user.authId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The requested profile not found or deleted.');
    }
    return isExistUser;
};
const getApplicants = async (query) => {
    const applicantQueryBuilder = new QueryBuilder_1.default(applicantProfile_model_1.ApplicantProfile.find({ openToWork: true }), query)
        .search([
        'firstName',
        'lastName',
        'preferredName',
        'skills',
        'city',
        'country',
    ])
        .filter()
        .sort()
        .fields()
        .paginate()
        .populate(['userId'], {
        userId: 'email name role image status verified',
    });
    const applicants = await applicantQueryBuilder.modelQuery.lean();
    const paginationInfo = await applicantQueryBuilder.getPaginationInfo();
    return {
        data: applicants,
        meta: paginationInfo,
    };
};
const deleteMyAccount = async (user) => {
    const isExistUser = await user_model_1.User.findById(user.authId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The requested profile not found or deleted.');
    }
    if (isExistUser.role === user_1.USER_ROLES.APPLICANT && isExistUser.profile) {
        const res = await applicantProfile_model_1.ApplicantProfile.findByIdAndDelete(isExistUser.profile);
        if (res) {
            await user_model_1.User.findByIdAndDelete(isExistUser._id);
        }
    }
    else if (isExistUser.role === user_1.USER_ROLES.RECRUITER && isExistUser.profile) {
        const res = await recruiterProfile_model_1.RecruiterProfile.findByIdAndDelete(isExistUser.profile);
        if (res) {
            await user_model_1.User.findByIdAndDelete(isExistUser._id);
        }
    }
    return 'Account deleted successfully';
};
exports.UserServices = {
    updateProfile: exports.updateProfile,
    updateUserRoleAndCreateProfile,
    createAdmin,
    getAllUser,
    getSingleUser,
    deleteUser,
    getProfile,
    getApplicants,
    getCurrentUser,
    deleteMyAccount,
    addApplicantPortfolio,
    removeApplicantPortfolio,
};
