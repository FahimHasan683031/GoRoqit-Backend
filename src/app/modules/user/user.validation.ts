import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.interface";

export const userSignupSchema = z.object({
 body:z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
  role: z.enum(["admin", "applicant", "recruiter"]),
 })
});

export const userLoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const userUpdateSchema = z.object({
  email: z.string().email().trim().toLowerCase().optional(),
  password: z.string().min(6).optional(),
  status: z.nativeEnum(USER_STATUS).optional(),
  verified: z.boolean().optional(),
  role: z.nativeEnum(USER_ROLES).optional(),
});

export const UserValidations={
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
}















