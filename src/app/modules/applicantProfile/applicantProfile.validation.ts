import { z } from "zod";

// Education Schema
export const educationSchema = z.object({
  degreeTitle: z.string().min(1, "Degree title is required"),
  instituteName: z.string().min(1, "Institute name is required"),
  major: z.string().optional(),
  result: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Work Experience Schema
export const workExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  duration: z.string().optional(),
});

// Applicant Data Schema
export const applicantDataSchema = z.object({
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

// Applicant Profile Create Schema
export const applicantProfileCreateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required").max(50).trim(),
    lastName: z.string().max(50).trim().optional(),
    phone: z.string().trim().optional(),
    bio: z.string().max(500).optional(),
    applicantData: applicantDataSchema.optional(),
  })
});

// Applicant Profile Update Schema
export const applicantProfileUpdateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().max(50).trim().optional(),
    phone: z.string().trim().optional(),
    bio: z.string().max(500).optional(),
    resume: z.string().optional(),
    skills: z.array(z.string()).optional(),
    education: z.array(educationSchema).optional(),
    workExperience: z.array(workExperienceSchema).optional(),
    preferredWorkType: z
      .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
      .optional(),
    languages: z.array(z.string()).optional(),
    salaryExpectation: z.string().optional(),
    openToWork: z.boolean().optional(),
  })
});

// Resume Generation Schema
export const generateResumeSchema = z.object({
  body: z.object({
    template: z.enum(["modern", "classic", "professional"]).default("modern"),
    includePhoto: z.boolean().default(false),
  })
});

export const applicantProfileValidations = {
  educationSchema,
  workExperienceSchema,
  applicantDataSchema,
  createProfile: applicantProfileCreateSchema,
  updateProfile: applicantProfileUpdateSchema,
  generateResume: generateResumeSchema,
};