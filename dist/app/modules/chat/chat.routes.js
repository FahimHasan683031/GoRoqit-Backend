"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.route("/")
    .post((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), async (req, res, next) => {
    try {
        req.body = [req.user.authId, ...req.body.participants];
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create chat" });
    }
}, chat_controller_1.ChatController.createChat)
    .get((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER, user_interface_1.USER_ROLES.APPLICANT), chat_controller_1.ChatController.getChat);
exports.ChatRoutes = router;
