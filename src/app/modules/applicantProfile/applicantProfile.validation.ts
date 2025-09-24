import { z } from "zod";

// Education Schema
export const educationSchema = z.object({
  degreeTitle: z.string().min(1, "Degree title is required"),
  instituteName: z.string().min(1, "Institute name is required"),
  major: z.string().optional(),
  result: z.string().optional(),
  scale: z.string().optional(),
  duration: z.string().optional(),
  yearOfPassing: z.number().optional(),
  cgpa: z.number().optional(),
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
  experience: z.string().optional(),
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
  middleName: z.string().max(50).trim().optional(),
  preferredName: z.string().max(50).trim().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Widowed"])
    .optional(),
  citizenship: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  age: z.number().optional(),
  previousEmployment: z.enum(["Yes", "No"]).optional(),
  compiteAddrase: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  province: z.string().optional(),
  mobile: z.string().optional(),
  landLine: z.string().optional(),
});

// Applicant Profile Create Schema
export const applicantProfileCreateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required").max(50).trim(),
    lastName: z.string().max(50).trim().optional(),
    phone: z.string().trim().optional(),
    bio: z.string().max(500).optional(),
    applicantData: applicantDataSchema.optional(),
    middleName: z.string().max(50).trim().optional(),
    preferredName: z.string().max(50).trim().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    maritalStatus: z
      .enum(["Single", "Married", "Divorced", "Widowed"])
      .optional(),
    citizenship: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    age: z.number().optional(),
    previousEmployment: z.enum(["Yes", "No"]).optional(),
    compiteAddrase: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    province: z.string().optional(),
    mobile: z.string().optional(),
    landLine: z.string().optional(),
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
    middleName: z.string().max(50).trim().optional(),
    preferredName: z.string().max(50).trim().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    maritalStatus: z
      .enum(["Single", "Married", "Divorced", "Widowed"])
      .optional(),
    citizenship: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    age: z.number().optional(),
    previousEmployment: z.enum(["Yes", "No"]).optional(),
    compiteAddrase: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    province: z.string().optional(),
    mobile: z.string().optional(),
    landLine: z.string().optional(),
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