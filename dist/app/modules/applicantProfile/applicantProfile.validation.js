"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantProfileUpdateSchema = exports.WorkExperienceUpdateSchema = exports.EducationUpdateSchema = void 0;
const zod_1 = require("zod");
// Reuse education & work experience schemas
exports.EducationUpdateSchema = zod_1.z.object({
    degreeTitle: zod_1.z.string().optional(),
    instituteName: zod_1.z.string().optional(),
    major: zod_1.z.string().optional(),
    result: zod_1.z.string().optional(),
    scale: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    yearOfPassing: zod_1.z.number().optional(),
    cgpa: zod_1.z.number().optional(),
});
exports.WorkExperienceUpdateSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().optional(),
    companyName: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    employmentType: zod_1.z
        .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
        .optional(),
    startDate: zod_1.z.preprocess((arg) => (arg ? new Date(arg) : undefined), zod_1.z.date().optional()),
    endDate: zod_1.z.preprocess((arg) => (arg ? new Date(arg) : undefined), zod_1.z.date().optional()),
    experience: zod_1.z.string().optional(),
});
exports.ApplicantProfileUpdateSchema = zod_1.z.object({
    resume: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    expartes: zod_1.z.array(zod_1.z.string()).optional(),
    education: zod_1.z.array(exports.EducationUpdateSchema).optional(),
    workExperience: zod_1.z.array(exports.WorkExperienceUpdateSchema).optional(),
    preferredWorkType: zod_1.z
        .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
        .optional(),
    languages: zod_1.z.array(zod_1.z.string()).optional(),
    salaryExpectation: zod_1.z.string().optional(),
    openToWork: zod_1.z.boolean().optional(),
    firstName: zod_1.z.string().optional(),
    middleName: zod_1.z.string().optional(),
    preferredName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
    maritalStatus: zod_1.z
        .enum(["Single", "Married", "Divorced", "Widowed"])
        .optional(),
    citizenship: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.preprocess((arg) => (arg ? new Date(arg) : undefined), zod_1.z.date().optional()),
    age: zod_1.z.number().optional(),
    previousEmployment: zod_1.z.enum(["Yes", "No"]).optional(),
    streetAddress: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    province: zod_1.z.string().optional(),
    mobile: zod_1.z.string().optional(),
    landLine: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional()
});
