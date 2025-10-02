"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidations = void 0;
const zod_1 = require("zod");
exports.ApplicationValidations = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            job: zod_1.z.string(),
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            location: zod_1.z.string(),
            email: zod_1.z.string(),
            phone: zod_1.z.string(),
            resume: zod_1.z.string(),
            experience: zod_1.z.string()
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            job: zod_1.z.string().optional(),
            name: zod_1.z.string().optional(),
            title: zod_1.z.string().optional(),
            location: zod_1.z.string().optional(),
            email: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            resume: zod_1.z.string().optional(),
            experience: zod_1.z.string().optional()
        }),
    }),
};
