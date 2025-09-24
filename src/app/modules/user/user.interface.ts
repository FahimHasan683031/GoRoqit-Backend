import { Model, Types } from "mongoose";
import { IEducation, IWorkExperience } from "../profile/profile.interface";

export enum USER_ROLES {
  ADMIN = "admin",
  APPLICANT = "applicant",
  RECRUITER = "recruiter",
  GUEST = "guest",
}

export enum USER_STATUS {
  ACTIVE = "active",
  RESTRICTED = "restricted",
  DELETED = "deleted",
}

type IAuthentication = {
  restrictionLeftAt: Date | null
  resetPassword: boolean
  wrongLoginAttempts: number
  passwordChangedAt?: Date
  oneTimeCode: string
  latestRequestAt: Date
  expiresAt?: Date
  requestCount?: number
  authType?: 'createAccount' | 'resetPassword'
}

export type IUser = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  status: USER_STATUS;
  verified: boolean;
  role: USER_ROLES;
  companyName?: string;
  image?: string;
  authentication: IAuthentication;
  profile?: Types.ObjectId | null;
  roleProfile?: 'ApplicantProfile' | 'RecruiterProfile' | null;
  createdAt: Date;
  updatedAt: Date;
  subscribe?: boolean;
};



export interface IUpdateProfilePayload {
  authId: string;
  name?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  resume?: string;
  skills?: string[];
  education?: IEducation[]; 
  workExperience?: IWorkExperience[];
  preferredWorkType?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  languages?: string[];
  salaryExpectation?: string;
  openToWork?: boolean;
  bio?: string;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
}

export type UserModel = {
  isPasswordMatched: (givenPassword: string, savedPassword: string) => Promise<boolean>;
} & Model<IUser>;














