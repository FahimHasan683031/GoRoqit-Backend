import { z } from "zod"

// Reuse education & work experience schemas
export const EducationUpdateSchema = z.object({
  degreeTitle: z.string().optional(),
  instituteName: z.string().optional(),
  major: z.string().optional(),
  result: z.string().optional(),
  scale: z.string().optional(),
  duration: z.string().optional(),
  yearOfPassing: z.number().optional(),
  cgpa: z.number().optional(),
})

export const WorkExperienceUpdateSchema = z.object({
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  location: z.string().optional(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  startDate: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  endDate: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  experience: z.string().optional(),
})

export const ApplicantProfileUpdateSchema = z.object({
  resume: z.string().optional(),
  skills: z.array(z.string()).optional(),
  expartes: z.array(z.string()).optional(),
  education: z.array(EducationUpdateSchema).optional(),
  workExperience: z.array(WorkExperienceUpdateSchema).optional(),
  preferredWorkType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship", "Other"])
    .optional(),
  languages: z.array(z.string()).optional(),
  salaryExpectation: z.string().optional(),
  openToWork: z.boolean().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  maritalStatus: z
    .enum(["Single", "Married", "Divorced", "Widowed"])
    .optional(),
  citizenship: z.string().optional(),
  dateOfBirth: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  age: z.number().optional(),
  previousEmployment: z.enum(["Yes", "No"]).optional(),
  streetAddress: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  province: z.string().optional(),
  mobile: z.string().optional(),
  landLine: z.string().optional(),
  bio: z.string().optional()
})
