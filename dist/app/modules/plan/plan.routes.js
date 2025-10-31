"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const plan_controller_1 = require("./plan.controller");
const plan_validation_1 = require("./plan.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.route("/")
    .post((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(plan_validation_1.createPlanZodValidationSchema), plan_controller_1.PlanController.createPlan)
    .get((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN, user_interface_1.USER_ROLES.RECRUITER), plan_controller_1.PlanController.getPlan);
router.post("/create-checkout-session/:planId", (0, auth_1.default)(user_interface_1.USER_ROLES.RECRUITER), plan_controller_1.PlanController.createCheckoutSession);
router
    .route("/:id")
    .patch((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(plan_validation_1.updatePlanZodValidationSchema), plan_controller_1.PlanController.updatePlan)
    .delete((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), plan_controller_1.PlanController.deletePlan);
exports.PlanRoutes = router;
