"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get('/statistics', (0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), dashboard_controller_1.DashboardControllers.getDashboardStatistics);
router.get('/recruter-statistics', (0, auth_1.default)(user_interface_1.USER_ROLES.RECRUITER), dashboard_controller_1.DashboardControllers.rectuterStatistics);
exports.DashboardRoutes = router;
