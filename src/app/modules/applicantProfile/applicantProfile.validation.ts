import { z } from "zod"

// Reuse education & work experience schemas
export const EducationSchema = z.object({
  body: z.object({
    degreeTitle: z.string().min(1, "Degree title is required").optional(),
    instituteName: z.string().min(1, "Institute name is required").optional(),
    major: z.string().optional(),
    duration: z.string().optional(),
    yearOfPassing: z.string().optional(),
    description: z.string().optional(),
    certificate: z.array(z.string()).optional(),
  }).strict()
})

export const WorkExperienceUpdateSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").optional(),
  companyName: z.string().min(1, "Company name is required").optional(),
  location: z.string().optional(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Temp", "Self-employed", "Chair-rental"])
    .optional(),
  startDate: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().max(new Date(), "Start date cannot be in the future").optional()
  ),
  endDate: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().max(new Date(), "End date cannot be in the future").optional()
  ),
  experience: z.string().optional(),
}).strict()

export const PortfolioSchema = z.object({
 body: z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  portfolioImages: z.array(z.string()).optional(),
 }).strict()
})

export const SalaryExpectationUpdateSchema = z.object({
  type: z.enum(["yearly", "monthly", "weekly", "hourly"]).optional(),
  amount: z.number().min(0, "Amount must be positive").optional(),
}).strict()

export const ApplicantProfileUpdateSchema = z.object({
  resume: z.string().optional(),
  skills: z.array(z.string()).optional(),
  expartes: z.array(z.string()).optional(),
  education: z.array(EducationSchema).optional(),
  workExperience: z.array(WorkExperienceUpdateSchema).optional(),
  portfolio: z.array(PortfolioSchema).optional(),
  preferredWorkType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  languages: z.array(z.string()).optional(),
  salaryExpectation: SalaryExpectationUpdateSchema.optional(),
  openToWork: z.boolean().optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Widowed"])
    .optional(),
  citizenship: z.string().optional(),
  dateOfBirth: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().max(new Date(), "Date of birth cannot be in the future").optional()
  ),
  age: z.number().optional(), 
  previousEmployment: z.enum(["Yes", "No"]).optional(),
  streetAddress: z.string().optional(),
  country: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  province: z.string().optional(),
  mobile: z.string().optional(),
  landLine: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional()
}).strict()