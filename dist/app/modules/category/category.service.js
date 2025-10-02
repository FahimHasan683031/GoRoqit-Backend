"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.deleteCategory = exports.getCategories = exports.createCategory = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const category_model_1 = require("./category.model");
// create category
const createCategory = async (payload) => {
    const category = await category_model_1.Category.create(payload);
    return category;
};
exports.createCategory = createCategory;
// get categories
const getCategories = async (query) => {
    const categoryQueryBuilder = new QueryBuilder_1.default(category_model_1.Category.find(), query)
        .filter()
        .sort()
        .paginate();
    const categories = await categoryQueryBuilder.modelQuery;
    const paginationInfo = await categoryQueryBuilder.getPaginationInfo();
    return {
        data: categories,
        meta: paginationInfo,
    };
};
exports.getCategories = getCategories;
// Delete category
const deleteCategory = async (id) => {
    const category = await category_model_1.Category.findByIdAndDelete(id);
    return category;
};
exports.deleteCategory = deleteCategory;
// Update category
const updateCategory = async (id, payload) => {
    const category = await category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return category;
};
exports.updateCategory = updateCategory;
