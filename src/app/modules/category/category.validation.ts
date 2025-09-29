
import { z } from "zod";

// create category validation schema
export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    status: z.boolean().optional(),
  }),
});

// update category validation schema
export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.boolean().optional(),
  }),
});
