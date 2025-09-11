import { z } from "zod";


const educationSchema = z.object({
  degreeTitle: z.string().min(1),
  instituteName: z.string().min(1),
  major: z.string().optional(),
  result: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});


const workExperienceSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  location: z.string().optional(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  duration: z.string().optional(),
});

const applicantDataSchema = z.object({
  resume: z.string().optional(),
  skills: z.array(z.string()).default([]),
  education: z.array(educationSchema).default([]),
  workExperience: z.array(workExperienceSchema).default([]),
  preferredWorkType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  languages: z.array(z.string()).default([]),
  salaryExpectation: z.string().optional(),
  openToWork: z.boolean().default(false),
});


const recruiterDataSchema = z.object({
  companyName: z.string().min(1),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().url().optional(),
});


const adminDataSchema = z.object({
  permissions: z.array(z.string()).default([]),
});


export const profileBaseSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().max(50).trim().optional(),
  image: z.string().url().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().max(500).optional(),
});


const applicantProfile = profileBaseSchema.extend({
  role: z.literal("applicant"),
  applicantData: applicantDataSchema.optional(),
});

const recruiterProfile = profileBaseSchema.extend({
  role: z.literal("recruiter"),
  recruiterData: recruiterDataSchema,
});

const adminProfile = profileBaseSchema.extend({
  role: z.literal("admin"),
  adminData: adminDataSchema.optional(),
});

// Create a wrapper schema that satisfies AnyZodObject
export const profileCreateSchema = z.object({
  body: z.union([
    applicantProfile,
    recruiterProfile,
    adminProfile,
  ])
});


const profileUpdateBaseSchema = profileBaseSchema.extend({
  firstName: z.string().min(1).max(50).trim().optional(),
  lastName: z.string().max(50).trim().optional(),
  image: z.string().url().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().max(500).optional(),
  applicantData: applicantDataSchema.optional(),
  recruiterData: recruiterDataSchema.optional(),
  adminData: adminDataSchema.optional(),
});


export const profileUpdateSchema = z.object({
  body: profileUpdateBaseSchema
});


export const profileValidations = {
  createProfile: profileCreateSchema,
  updateProfile: profileUpdateSchema,
};
