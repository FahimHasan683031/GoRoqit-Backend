"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileServices = exports.UpdateProfile = void 0;
const profile_model_1 = require("./profile.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const recruiterProfile_model_1 = require("../recruiterProfile/recruiterProfile.model");
const applicantProfile_model_1 = require("../applicantProfile/applicantProfile.model");
// Create Profile
const CreateOrUpdataeProfile = async (user, payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        payload.userId = user.authId;
        // Check if user exists
        const isExistUser = await user_model_1.User.findById(user.authId).session(session);
        console.log('CreateOrUpdataeProfile', isExistUser);
        if (!isExistUser) {
            throw new Error("User not found");
        }
        if (isExistUser.role !== payload.role) {
            throw new Error("Role can't be updated");
        }
        // Check if profile exists
        let profile = await profile_model_1.Profile.findOne({ userId: user.authId }).session(session);
        if (profile) {
            // Update profile fields
            profile = await profile_model_1.Profile.findByIdAndUpdate(profile._id, payload, {
                new: true,
                runValidators: true,
                session,
            });
        }
        // Commit transaction
        await session.commitTransaction();
        return profile;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
// Get all profile
const GetAllProfile = async () => {
    const res = await profile_model_1.Profile.find().populate('userId');
    return res;
};
// Get Profile
const GetProfile = async (user) => {
    const res = await profile_model_1.Profile.findOne({ userId: user.authId }).populate('userId');
    return res;
};
const UpdateProfile = async (payload) => {
    // 1. Update User basic fields (NO EMAIL update allowed)
    const user = await user_model_1.User.findOneAndUpdate({ _id: payload.authId, status: { $ne: user_interface_1.USER_STATUS.DELETED } }, {
        ...(payload.name && { name: payload.name }),
        ...(payload.phone && { phone: payload.phone }),
    }, { new: true });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found or deleted.");
    }
    // 2. Update role-based profile
    if (user.role === user_interface_1.USER_ROLES.APPLICANT && user.profile) {
        await applicantProfile_model_1.ApplicantProfile.findByIdAndUpdate(user.profile, {
            ...(payload.firstName && { firstName: payload.firstName }),
            ...(payload.lastName && { lastName: payload.lastName }),
            ...(payload.resume && { resume: payload.resume }),
            ...(payload.skills && { skills: payload.skills }),
            ...(payload.education && { education: payload.education }),
            ...(payload.workExperience && { workExperience: payload.workExperience }),
            ...(payload.preferredWorkType && { preferredWorkType: payload.preferredWorkType }),
            ...(payload.languages && { languages: payload.languages }),
            ...(payload.salaryExpectation && { salaryExpectation: payload.salaryExpectation }),
            ...(payload.openToWork !== undefined && { openToWork: payload.openToWork }),
            ...(payload.bio && { bio: payload.bio }),
        }, { new: true });
    }
    else if (user.role === user_interface_1.USER_ROLES.RECRUITER && user.profile) {
        await recruiterProfile_model_1.RecruiterProfile.findByIdAndUpdate(user.profile, {
            ...(payload.firstName && { firstName: payload.firstName }),
            ...(payload.lastName && { lastName: payload.lastName }),
            ...(payload.companyName && { companyName: payload.companyName }),
            ...(payload.companyWebsite && { companyWebsite: payload.companyWebsite }),
            ...(payload.companyDescription && { companyDescription: payload.companyDescription }),
            ...(payload.bio && { bio: payload.bio }),
        }, { new: true });
    }
    return "Profile updated successfully.";
};
exports.UpdateProfile = UpdateProfile;
exports.profileServices = {
    CreateOrUpdataeProfile,
    GetProfile,
    UpdateProfile: exports.UpdateProfile,
    GetAllProfile
};
