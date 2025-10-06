import { z } from 'zod'

export const JobValidations = {
  createJobZodSchema: z.object({
    body: z.object({
      title: z.string(),
      category: z.string().optional(),
      type: z.enum(['Full-time', 'Remote', 'Freelance']),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      minSalary: z.number().min(0),
      maxSalary: z.number().min(0),
      description: z.string().optional(),
      responsibilities: z.string().optional(),
      jobLocation: z.string().min(3),
      experianceLabel: z.enum(['Experienced', 'Beginner', 'Freshers', 'Part-time', 'Contract']),
    }),
  }),

  updateJobZodSchema: z.object({
    body: z.object({
      title: z.string().optional(),
      category: z.string().optional(),
      type: z.enum(['Full-time', 'Remote', 'Freelance', 'Part-time', 'Contract']).optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      minSalary: z.number().min(0).optional(),
      maxSalary: z.number().min(0).optional(),
      description: z.string().optional(),
      responsibilities: z.string().optional(),
      jobLocation: z.string().min(3).optional(),
      experianceLabel: z.enum(['Experienced', 'Beginner', 'Freshers']).optional(),
    }),
  }),
}
