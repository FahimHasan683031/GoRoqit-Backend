import { z } from 'zod';

export const JobValidations = {
  create: z.object({
    title: z.string(),
    category: z.string(),
    type: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    userEmail: z.string(),
    description: z.string(),
    responsibilities: z.string(),
  }),

  update: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    userEmail: z.string().optional(),
    description: z.string().optional(),
    responsibilities: z.string().optional(),
  }),
};
