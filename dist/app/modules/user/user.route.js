"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const processReqBody_1 = require("../../middleware/processReqBody");
const router = express_1.default.Router();
router.patch('/profile', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER), (0, processReqBody_1.fileAndBodyProcessorUsingDiskStorage)(), 
// validateProfileUpdate,
// validateRequest(RecruiterProfileUpdateSchema),
user_controller_1.UserController.updateProfile);
router.get('/me', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.RECRUITER, user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getProfile);
router.get('/', user_controller_1.UserController.getAllUser),
    // get applicants
    router.get('/applicants', user_controller_1.UserController.getApplicants);
// get current user
router.get('/current-user', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.RECRUITER, user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getCurrentUser);
// get single user
router.get('/:id', user_controller_1.UserController.getSingleUser);
// update user role and create profile
router.patch('/:id/role', user_controller_1.UserController.updateUserRoleAndCreateProfile);
// delete user
router.delete('/:id', user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
