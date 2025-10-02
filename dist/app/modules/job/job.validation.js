"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidations = void 0;
const zod_1 = require("zod");
exports.JobValidations = {
    createJobZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string(),
            category: zod_1.z.string().optional(),
            type: zod_1.z.enum(['Full-time', 'Remote', 'Freelance']),
            startDate: zod_1.z.string().datetime(),
            endDate: zod_1.z.string().datetime().optional(),
            minSalary: zod_1.z.number().min(0),
            maxSalary: zod_1.z.number().min(0),
            description: zod_1.z.string().max(500).optional(),
            responsibilities: zod_1.z.string().max(500).optional(),
            jobLocation: zod_1.z.string().min(3),
            experianceLabel: zod_1.z.enum(['Experienced', 'Beginner', 'Freshers', 'Part-time', 'Contract']),
        }),
    }),
    updateJobZodSchema: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().optional(),
            category: zod_1.z.string().optional(),
            type: zod_1.z.enum(['Full-time', 'Remote', 'Freelance', 'Part-time', 'Contract']).optional(),
            startDate: zod_1.z.string().datetime().optional(),
            endDate: zod_1.z.string().datetime().optional(),
            minSalary: zod_1.z.number().min(0).optional(),
            maxSalary: zod_1.z.number().min(0).optional(),
            description: zod_1.z.string().max(500).optional(),
            responsibilities: zod_1.z.string().max(500).optional(),
            jobLocation: zod_1.z.string().min(3).optional(),
            experianceLabel: zod_1.z.enum(['Experienced', 'Beginner', 'Freshers']).optional(),
        }),
    }),
};
