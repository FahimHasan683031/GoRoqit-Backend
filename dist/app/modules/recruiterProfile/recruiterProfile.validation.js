"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterProfileUpdateSchema = void 0;
const zod_1 = require("zod");
exports.RecruiterProfileUpdateSchema = zod_1.z.object({
    companyName: zod_1.z.string().optional(),
    companyWebsite: zod_1.z.string().url().optional(),
    companyDescription: zod_1.z.string().optional(),
    companyLogo: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    companyEmail: zod_1.z.string().email().optional(),
    location: zod_1.z.string().optional(),
    linkedinProfile: zod_1.z.string().url().optional(),
    twitterProfile: zod_1.z.string().url().optional(),
    facebookProfile: zod_1.z.string().url().optional(),
    instagramProfile: zod_1.z.string().url().optional(),
    bio: zod_1.z.string().optional()
});
