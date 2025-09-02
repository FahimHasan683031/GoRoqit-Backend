import { z } from 'zod'

export const ApplicantValidations = {
  create: z.object({
    body: z.object({
      job: z.string(),
      name: z.string(),
      title: z.string(),
      location: z.string(),
      email: z.string(),
      phone: z.string(),
      resume: z.string(),
      experience: z.number(),
      appliedAt: z.string().datetime(),
    }),
  }),

  update: z.object({
    body: z.object({
      job: z.string().optional(),
      name: z.string().optional(),
      title: z.string().optional(),
      location: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      resume: z.string().optional(),
      experience: z.number().optional(),
      appliedAt: z.string().datetime().optional(),
    }),
  }),
}
