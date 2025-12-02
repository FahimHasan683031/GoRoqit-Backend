import { z } from "zod"

export const RecruiterProfileUpdateSchema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  companyWebsite: z.string(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().optional(),
  phone: z.string().optional(),
  companyEmail: z.string(),
  location: z.string().optional(),
  linkedinProfile: z.string().optional(),
  twitterProfile: z.string().optional(),
  facebookProfile: z.string().optional(),
  instagramProfile: z.string().optional(),
}).strict()
