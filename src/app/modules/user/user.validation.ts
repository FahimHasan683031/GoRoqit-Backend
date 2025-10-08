import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.interface";

export const userSignupSchema = z.object({
 body:z.object({
  email: z.string().email().toLowerCase().trim(),
  name: z.string(),
  companyName: z.string().optional(),
  role: z.nativeEnum(USER_ROLES),
  image: z.string().optional(),
  password: z.string().min(6),
 })
});

export const userLoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const userUpdateSchema = z.object({
  email: z.string().email().trim().toLowerCase().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.nativeEnum(USER_STATUS).optional(),
  verified: z.boolean().optional(),
  companyName: z.string().optional(),
  role: z.nativeEnum(USER_ROLES).optional(),
});

export const UserValidations={
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
}















