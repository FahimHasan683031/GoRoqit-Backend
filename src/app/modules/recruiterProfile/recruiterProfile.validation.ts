import { z } from "zod";

// Recruiter Data Schema
export const recruiterDataSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().url().optional(),
});

// Recruiter Profile Create Schema
export const recruiterProfileCreateSchema = z.object({
  body: z.object({
    phone: z.string().trim().optional(),
    bio: z.string().max(500).optional(),
    recruiterData: recruiterDataSchema,
  })
});

// Recruiter Profile Update Schema
export const recruiterProfileUpdateSchema = z.object({
  body: z.object({
    phone: z.string().trim().optional(),
    bio: z.string().max(500).optional(),
    companyName: z.string().min(1).optional(),
    companyWebsite: z.string().url().optional(),
    companyDescription: z.string().optional(),
    companyLogo: z.string().url().optional(),
  })
});

export const recruiterProfileValidations = {
  recruiterDataSchema,
  createProfile: recruiterProfileCreateSchema,
  updateProfile: recruiterProfileUpdateSchema,
};