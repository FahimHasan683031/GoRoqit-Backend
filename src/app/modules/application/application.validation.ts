import { z } from 'zod'

export const ApplicationValidations = {
  create: z.object({
    body: z.object({
      job: z.string()
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
      experience: z.string().optional()
    }),
  }),
}
