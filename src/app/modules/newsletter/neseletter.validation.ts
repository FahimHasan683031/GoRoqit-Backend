import { z } from "zod";

const newsletterValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
})