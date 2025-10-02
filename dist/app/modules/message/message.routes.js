"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./message.controller");
const user_interface_1 = require("../user/user.interface");
const auth_1 = __importDefault(require("../../middleware/auth"));
const processReqBody_1 = require("../../middleware/processReqBody");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), (0, processReqBody_1.fileAndBodyProcessorUsingDiskStorage)(), message_controller_1.MessageController.sendMessage);
router.get('/:id', (0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), message_controller_1.MessageController.getMessage);
router.patch('/:id', (0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), (0, processReqBody_1.fileAndBodyProcessorUsingDiskStorage)(), message_controller_1.MessageController.updateMessage);
router.delete('/:id', (0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), message_controller_1.MessageController.deleteMessage);
exports.MessageRoutes = router;
