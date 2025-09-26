import { z } from "zod"

export const RecruiterProfileUpdateSchema = z.object({
  companyName: z.string().optional(),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().optional(),
  companyLogo: z.string().optional(),
  phone: z.string().optional(),
  companyEmail: z.string().email().optional(),
  location: z.string().optional(),
  linkedinProfile: z.string().url().optional(),
  twitterProfile: z.string().url().optional(),
  facebookProfile: z.string().url().optional(),
  instagramProfile: z.string().url().optional(),
  bio: z.string().optional()
})
