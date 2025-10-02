"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryController = exports.deleteCategoryController = exports.getCategoriesController = exports.createCategoryController = void 0;
const category_service_1 = require("./category.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
// create category
const createCategoryController = async (req, res) => {
    const payload = req.body;
    const category = await (0, category_service_1.createCategory)(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Category created successfully',
        data: category,
    });
};
exports.createCategoryController = createCategoryController;
// get categories
const getCategoriesController = async (req, res) => {
    const categories = await (0, category_service_1.getCategories)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
    });
};
exports.getCategoriesController = getCategoriesController;
// Delete category
const deleteCategoryController = async (req, res) => {
    const id = req.params.id;
    const category = await (0, category_service_1.deleteCategory)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Category deleted successfully',
        data: category,
    });
};
exports.deleteCategoryController = deleteCategoryController;
// Update category
const updateCategoryController = async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const category = await (0, category_service_1.updateCategory)(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Category updated successfully',
        data: category,
    });
};
exports.updateCategoryController = updateCategoryController;
