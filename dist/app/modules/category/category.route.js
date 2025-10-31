"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.route("/")
    .post((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(category_validation_1.createCategoryValidationSchema), category_controller_1.createCategoryController)
    .get(category_controller_1.getCategoriesController);
router
    .route("/:id")
    .patch((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), category_controller_1.updateCategoryController)
    .delete((0, auth_1.default)(user_interface_1.USER_ROLES.ADMIN), category_controller_1.deleteCategoryController);
exports.categoryRoutes = router;
