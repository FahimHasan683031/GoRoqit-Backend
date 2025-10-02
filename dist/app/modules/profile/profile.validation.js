"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidations = exports.profileUpdateSchema = exports.profileCreateSchema = exports.profileBaseSchema = void 0;
const zod_1 = require("zod");
const educationSchema = zod_1.z.object({
    degreeTitle: zod_1.z.string().min(1),
    instituteName: zod_1.z.string().min(1),
    major: zod_1.z.string().optional(),
    result: zod_1.z.string().optional(),
    grade: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
const workExperienceSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(1),
    companyName: zod_1.z.string().min(1),
    location: zod_1.z.string().optional(),
    employmentType: zod_1.z
        .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
        .optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    duration: zod_1.z.string().optional(),
});
const applicantDataSchema = zod_1.z.object({
    resume: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    education: zod_1.z.array(educationSchema).default([]),
    workExperience: zod_1.z.array(workExperienceSchema).default([]),
    preferredWorkType: zod_1.z
        .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
        .optional(),
    languages: zod_1.z.array(zod_1.z.string()).default([]),
    salaryExpectation: zod_1.z.string().optional(),
    openToWork: zod_1.z.boolean().default(false),
});
const recruiterDataSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    companyWebsite: zod_1.z.string().url().optional(),
    companyDescription: zod_1.z.string().optional(),
    companyLogo: zod_1.z.string().url().optional(),
});
const adminDataSchema = zod_1.z.object({
    permissions: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.profileBaseSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).trim(),
    lastName: zod_1.z.string().max(50).trim().optional(),
    image: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().trim().optional(),
    bio: zod_1.z.string().max(500).optional(),
});
const applicantProfile = exports.profileBaseSchema.extend({
    role: zod_1.z.literal("applicant"),
    applicantData: applicantDataSchema.optional(),
});
const recruiterProfile = exports.profileBaseSchema.extend({
    role: zod_1.z.literal("recruiter"),
    recruiterData: recruiterDataSchema,
});
const adminProfile = exports.profileBaseSchema.extend({
    role: zod_1.z.literal("admin"),
    adminData: adminDataSchema.optional(),
});
// Create a wrapper schema that satisfies AnyZodObject
exports.profileCreateSchema = zod_1.z.object({
    body: zod_1.z.union([
        applicantProfile,
        recruiterProfile,
        adminProfile,
    ])
});
const profileUpdateBaseSchema = exports.profileBaseSchema.extend({
    firstName: zod_1.z.string().min(1).max(50).trim().optional(),
    lastName: zod_1.z.string().max(50).trim().optional(),
    image: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().trim().optional(),
    bio: zod_1.z.string().max(500).optional(),
    applicantData: applicantDataSchema.optional(),
    recruiterData: recruiterDataSchema.optional(),
    adminData: adminDataSchema.optional(),
});
exports.profileUpdateSchema = zod_1.z.object({
    body: profileUpdateBaseSchema
});
exports.profileValidations = {
    createProfile: exports.profileCreateSchema,
    updateProfile: exports.profileUpdateSchema,
};
