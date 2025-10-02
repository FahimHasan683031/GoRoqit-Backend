"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_auth_controller_1 = require("./passport.auth/passport.auth.controller");
const custom_auth_controller_1 = require("./custom.auth/custom.auth.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const user_1 = require("../../../enum/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_validation_1 = require("../user/user.validation");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const getFilePath_1 = require("../../../shared/getFilePath");
const router = express_1.default.Router();
router.post('/signup', (0, fileUploadHandler_1.default)(), async (req, res, next) => {
    try {
        const image = (0, getFilePath_1.getSingleFilePath)(req.files, "image");
        req.body = {
            image,
            ...req.body
        };
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Failed to upload Category Image" });
    }
}, (0, validateRequest_1.default)(user_validation_1.UserValidations.userSignupSchema), custom_auth_controller_1.CustomAuthController.createUser);
router.post('/admin-login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), custom_auth_controller_1.CustomAuthController.adminLogin);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), passport_1.default.authenticate('local', { session: false }), passport_auth_controller_1.PassportAuthController.login);
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), passport_auth_controller_1.PassportAuthController.googleAuthCallback);
router.post('/verify-account', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.verifyAccountZodSchema), custom_auth_controller_1.CustomAuthController.verifyAccount);
router.post('/custom-login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), custom_auth_controller_1.CustomAuthController.customLogin);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.forgetPasswordZodSchema), custom_auth_controller_1.CustomAuthController.forgetPassword);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.resetPasswordZodSchema), custom_auth_controller_1.CustomAuthController.resetPassword);
router.post('/resend-otp', 
// tempAuth(
//   USER_ROLES.ADMIN,
//   USER_ROLES.APPLICANT,
//   USER_ROLES.RECRUITER,
// ),
(0, validateRequest_1.default)(auth_validation_1.AuthValidations.resendOtpZodSchema), custom_auth_controller_1.CustomAuthController.resendOtp);
router.post('/change-password', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.RECRUITER), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.changePasswordZodSchema), custom_auth_controller_1.CustomAuthController.changePassword);
router.delete('/delete-account', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER, user_1.USER_ROLES.APPLICANT), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.deleteAccount), custom_auth_controller_1.CustomAuthController.deleteAccount);
router.post('/access-token', custom_auth_controller_1.CustomAuthController.getAccessToken);
router.post('/social-login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.socialLoginZodSchema), custom_auth_controller_1.CustomAuthController.socialLogin);
exports.AuthRoutes = router;
