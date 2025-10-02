"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const zod_1 = require("zod");
exports.ReviewValidations = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            reviewee: zod_1.z.string(),
            rating: zod_1.z.number(),
            review: zod_1.z.string().optional(),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            reviewee: zod_1.z.string().optional(),
            rating: zod_1.z.number().optional(),
            review: zod_1.z.string().optional(),
        }),
    }),
};
