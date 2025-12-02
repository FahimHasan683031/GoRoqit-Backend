import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.interface";
import { EducationSchema, PortfolioSchema, SalaryExpectationUpdateSchema, WorkExperienceUpdateSchema } from "../applicantProfile/applicantProfile.validation";

export const userSignupSchema = z.object({
 body:z.object({
  email: z.string().email().toLowerCase().trim(),
  name: z.string(),
  companyName: z.string().optional(),
  role: z.nativeEnum(USER_ROLES),
  image: z.string().optional(),
  password: z.string().min(6),
 })
});

export const userLoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const userUpdateSchema = z.object({
  email: z.string().email().trim().toLowerCase().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.nativeEnum(USER_STATUS).optional(),
  verified: z.boolean().optional(),
  companyName: z.string().optional(),
  role: z.nativeEnum(USER_ROLES).optional(),
});


// Simple merged schema (recommended for common API)
export const UniversalProfileUpdateSchema = z.object({
  body: z.object({
    // Common fields that might overlap
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    image: z.string().optional(),
    
    // Applicant fields (all optional)
    resume: z.string().optional(),
    skills: z.array(z.string()).optional(),
    expartes: z.array(z.string()).optional(),
    education: z.array(EducationSchema).optional(),
    workExperience: z.array(WorkExperienceUpdateSchema).optional(),
    portfolio: z.array(PortfolioSchema).optional(),
    preferredWorkType: z.enum(["Full-time", "Part-time", "Temp", "Self-employed", "Chair-rental"]).optional(),
    languages: z.array(z.string()).optional(),
    salaryExpectation: SalaryExpectationUpdateSchema.optional(),
    openToWork: z.boolean().optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    middleName: z.string().optional(),
    preferredName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional(),
    citizenship: z.string().optional(),
    dateOfBirth: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date().max(new Date(), "Date of birth cannot be in the future").optional()
    ),
    age: z.number().optional(),
    previousEmployment: z.enum(["Yes", "No"]).optional(),
    streetAddress: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    landLine: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    
    // Recruiter fields (all optional)
    companyName: z.string().min(1, "Company name is required").optional(),
    companyWebsite: z.string().optional(),
    companyDescription: z.string().optional(),
    companyLogo: z.string().optional(),
    companyEmail: z.string(),
    linkedinProfile: z.string().optional(),
    twitterProfile: z.string().optional(),
    facebookProfile: z.string().optional(),
    instagramProfile: z.string().optional(),
  }).strict(), 
  query: z.object({}).optional(), 
  params: z.object({}).optional(), 
  cookies: z.object({}).optional(), 
}).strict();

export const UserValidations={
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
  UniversalProfileUpdateSchema
}















