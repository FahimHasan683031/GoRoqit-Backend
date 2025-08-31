import { Model, Types } from 'mongoose'

export type IAuthentication = {
  restrictionLeftAt: Date | null
  resetPassword: boolean
  wrongLoginAttempts: number
  passwordChangedAt?: Date
  oneTimeCode: string | null
  latestRequestAt: Date | null
  expiresAt?: Date | null
  requestCount?: number
  authType?: 'createAccount' | 'resetPassword' | null
}

export type Point = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export enum USER_ROLES {
  ADMIN = 'admin',
  APPLICANT = 'applicant',
  RECRUITER = 'recruiter',
}

export enum USER_STATUS {
  ACTIVE = 'active',
  RESTRICTED = 'restricted',
  DELETED = 'deleted',
}

export type IAdminProfile = {
  name: string
  image?: string
}

export type IApplicantProfile = {
  name: string
  resume?: string
  skills?: string[]
  experience?: string
  education?: string
}

export type IRecruiterProfile = {
  name: string
  companyName: string
  companyWebsite?: string
  companyDescription?: string
}

export type IUser = {
  _id: Types.ObjectId
  password: string
  email: string
  phone?: string
  status: USER_STATUS
  verified: boolean
  role: USER_ROLES
  address?: string
  profile?: string
  appId?: string
  deviceToken?: string
  authentication: IAuthentication
  createdAt: Date
  updatedAt: Date

  // Union role-specific profile fields
  adminProfile?: IAdminProfile
  applicantProfile?: IApplicantProfile
  recruiterProfile?: IRecruiterProfile
}

export type UserModel = {
  isPasswordMatched: (
    givenPassword: string,
    savedPassword: string,
  ) => Promise<boolean>
} & Model<IUser>














// import { Model, Types } from 'mongoose'

// type IAuthentication = {
//   restrictionLeftAt: Date | null
//   resetPassword: boolean
//   wrongLoginAttempts: number
//   passwordChangedAt?: Date
//   oneTimeCode: string
//   latestRequestAt: Date
//   expiresAt?: Date
//   requestCount?: number
//   authType?: 'createAccount' | 'resetPassword'
// }


// export type Point = {
//   type: 'Point'
//   coordinates: [number, number] // [longitude, latitude]
// }

// export type IUser = {
//   _id: Types.ObjectId
//   name?: string
//   email?: string
//   profile?: string
//   phone?: string
//   status: string
//   verified: boolean
//   address?: string
//   location: Point
//   password: string
//   role: string
//   appId?: string
//   deviceToken?: string

//   authentication: IAuthentication
//   createdAt: Date
//   updatedAt: Date
// }

// export type UserModel = {
//   isPasswordMatched: (
//     givenPassword: string,
//     savedPassword: string,
//   ) => Promise<boolean>
// } & Model<IUser>
