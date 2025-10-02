"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryValidationSchema = exports.createCategoryValidationSchema = void 0;
const zod_1 = require("zod");
// create category validation schema
exports.createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required"),
        description: zod_1.z.string().optional(),
        status: zod_1.z.boolean().optional(),
    }),
});
// update category validation schema
exports.updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.boolean().optional(),
    }),
});
