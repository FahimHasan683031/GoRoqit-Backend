import { z } from 'zod'

export const JobValidations = {
  createJobZodSchema: z.object({
    body: z.object({
      title: z.string(),
      category: z.string(),
      type: z.enum(['Full-time', 'Part-time', 'Temp']),
      engagementType: z.enum(['Self-employed', 'Chair-rental', 'Salaried']),
      startDate: z.string().datetime(),
      paymentType: z.enum(['yearly', 'monthly', 'weekly', 'hourly']),
      minSalary: z.number().min(0).optional(),
      maxSalary: z.number().min(0).optional(),
      rent: z.number().min(0).optional(),
      description: z.string(),
      jobLocation: z.string().min(3),
      experianceLabel: z.enum(['Junior', 'Mid-Level', 'Senior', 'Master']),
    }),
  }),

  updateJobZodSchema: z.object({
    body: z.object({
      title: z.string().optional(),
      category: z.string().optional(),
      type: z.enum(['Full-time', 'Part-time', 'Temp']).optional(),
      engagementType: z.enum(['Self-employed', 'Chair-rental', 'Salaried']).optional(),
      startDate: z.string().datetime().optional(),
      paymentType: z.enum(['yearly', 'monthly', 'weekly', 'hourly']).optional(),
      minSalary: z.number().min(0).optional(),
      maxSalary: z.number().min(0).optional(),
      rent: z.number().min(0).optional(),
      description: z.string().optional(),
      jobLocation: z.string().min(3).optional(),
      experianceLabel: z.enum(['Junior', 'Mid-Level', 'Senior', 'Master']).optional(),
    }),
  }),
}
