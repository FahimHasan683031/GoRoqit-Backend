"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const processReqBody_1 = require("../../middleware/processReqBody");
const profile_validation_1 = require("./profile.validation");
const profile_controller_1 = require("./profile.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER), (0, processReqBody_1.fileAndBodyProcessorUsingDiskStorage)(), (0, validateRequest_1.default)(profile_validation_1.profileValidations.createProfile), profile_controller_1.profileControllers.createProfile);
router.get('/all', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER), profile_controller_1.profileControllers.getAllProfile),
    router.get('/', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER), profile_controller_1.profileControllers.getProfile);
router.patch('/', (0, auth_1.default)(user_1.USER_ROLES.APPLICANT, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.RECRUITER), (0, processReqBody_1.fileAndBodyProcessorUsingDiskStorage)(), (0, validateRequest_1.default)(profile_validation_1.profileValidations.updateProfile), profile_controller_1.profileControllers.updateProfile);
exports.ProfileRoutes = router;
