import { z } from 'zod'
import { USER_ROLES } from './user.interface'

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(USER_ROLES),
    address: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    profile: z.string().optional(),

    adminProfile: z
      .object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        image: z.string().optional(),
      })
      .optional(),

    applicantProfile: z
      .object({
        name: z.string(),
        resume: z.string().optional(),
        skills: z.array(z.string()).optional(),
        experience: z.string().optional(),
        education: z.string().optional(),
      })
      .optional(),

    recruiterProfile: z
      .object({
        name: z.string(),
        companyName: z.string(),
        companyWebsite: z.string().optional(),
        companyDescription: z.string().optional(),
      })
      .optional(),
  }),
})

const updateUserZodSchema = z.object({
  body: z.object({
    address: z.string().optional(),
    profile: z.string().optional(),
    adminProfile: z.any().optional(),
    applicantProfile: z.any().optional(),
    recruiterProfile: z.any().optional(),
  }),
})

export const UserValidations = {
  createUserZodSchema,
  updateUserZodSchema,
}










// import { z } from 'zod'
// import { USER_ROLES } from '../../../enum/user'
// import { profile } from 'console'

// const createUserZodSchema = z.object({
//   body: z.object({
//     email: z.string({ required_error: 'Email is required' }).email(),
//     password: z.string({ required_error: 'Password is required' }).min(6),
//     name: z.string({ required_error: 'Name is required' }).optional(),
//     phone: z.string({ required_error: 'Phone is required' }).optional(),
//     address: z.string().optional(),
//     role: z.enum(
//       [
//         USER_ROLES.ADMIN,
//         USER_ROLES.USER,
//         USER_ROLES.GUEST,
//         USER_ROLES.CUSTOMER,
//       ],
//       {
//         message: 'Role must be one of admin, user, guest',
//       },
//     ),
//   }),
// })

// const updateUserZodSchema = z.object({
//   body: z.object({
//     name: z.string().optional(),
//     phone: z.string().optional(),
//     address: z.string().optional(),
//     image: z.array(z.string()).optional(),
//   }),
// })

// export const UserValidations = { createUserZodSchema, updateUserZodSchema }
