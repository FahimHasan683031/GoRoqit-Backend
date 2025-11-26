import { z } from "zod"

export const RecruiterProfileUpdateSchema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  companyWebsite: z.string().url("Invalid URL format").optional(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().optional(),
  phone: z.string().optional(),
  companyEmail: z.string().email("Invalid email format").optional(),
  location: z.string().optional(),
  linkedinProfile: z.string().url("Invalid URL format").optional(),
  twitterProfile: z.string().url("Invalid URL format").optional(),
  facebookProfile: z.string().url("Invalid URL format").optional(),
  instagramProfile: z.string().url("Invalid URL format").optional(),
}).strict()
