"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportAuthServices = void 0;
const user_1 = require("../../../../enum/user");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../../errors/ApiError"));
const user_model_1 = require("../../user/user.model");
const user_interface_1 = require("../../user/user.interface");
const auth_helper_1 = require("../auth.helper");
const common_1 = require("../common");
const applicantProfile_model_1 = require("../../applicantProfile/applicantProfile.model");
const handleGoogleLogin = async (payload) => {
    const { emails, photos, displayName, id } = payload.profile;
    const email = emails[0].value.toLowerCase().trim();
    const isUserExist = await user_model_1.User.findOne({
        email,
        status: { $in: [user_1.USER_STATUS.ACTIVE, user_1.USER_STATUS.RESTRICTED] },
    });
    if (isUserExist) {
        //return only the token
        const tokens = auth_helper_1.AuthHelper.createToken(isUserExist._id, isUserExist.role);
        return (0, common_1.authResponse)(http_status_codes_1.StatusCodes.OK, `Welcome ${isUserExist.name} to our platform.`, isUserExist.role, tokens.accessToken, tokens.refreshToken);
    }
    const session = await user_model_1.User.startSession();
    session.startTransaction();
    const userData = {
        email: emails[0].value,
        name: displayName,
        verified: true,
        password: id,
        image: photos[0].value,
        status: user_1.USER_STATUS.ACTIVE,
        role: user_interface_1.USER_ROLES.APPLICANT,
    };
    try {
        const user = await user_model_1.User.create([userData], { session });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
        }
        const createdUser = user[0];
        const names = displayName.split(' ');
        const profile = await applicantProfile_model_1.ApplicantProfile.create([{ userId: createdUser._id, firstName: names[0], lastName: names[1] }], { session });
        if (!profile[0])
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create applicant profile.");
        const updatedUser = await user_model_1.User.findByIdAndUpdate(createdUser._id, { roleProfile: "ApplicantProfile", profile: profile[0]._id }, { new: true, session });
        //create token
        const tokens = auth_helper_1.AuthHelper.createToken(createdUser._id, createdUser.role);
        await session.commitTransaction();
        await session.endSession();
        return (0, common_1.authResponse)(http_status_codes_1.StatusCodes.OK, `Welcome ${createdUser.name} to our platform.`, createdUser.role, tokens.accessToken, tokens.refreshToken);
    }
    catch (error) {
        await session.abortTransaction(session);
        session.endSession();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
exports.PassportAuthServices = {
    handleGoogleLogin,
};
