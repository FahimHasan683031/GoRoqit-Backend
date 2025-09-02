import { z } from 'zod'

export const JobValidations = {
  createJobZodSchema: z.object({
    body: z.object({
      title: z.string(),
      category: z.string(),
      type: z.enum(['Full-time', 'Remote', 'Freelance']),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      userEmail: z.string().email(),
      description: z.string().max(500),
      responsibilities: z.string().max(500),
    }),
  }),

  updateJobZodSchema: z.object({
    body: z.object({
      title: z.string().optional(),
      category: z.string().optional(),
      type: z.enum(['Full-time', 'Remote', 'Freelance']).optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      userEmail: z.string().email().optional(),
      description: z.string().max(500).optional(),
      responsibilities: z.string().max(500).optional(),
    }),
  }),
}
