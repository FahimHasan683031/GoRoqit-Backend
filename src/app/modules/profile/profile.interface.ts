import { Types } from "mongoose";
import { USER_ROLES } from "../user/user.interface";


export type IEducation = {
  degreeTitle: string;
  instituteName: string;
  major?: string;
  result?: string;
  grade?: string;
  startDate?: Date;
  endDate?: Date;
};

export type IWorkExperience = {
  jobTitle: string;
  companyName: string;
  location?: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  startDate?: Date;
  endDate?: Date;
  duration?: string;
};

export type IApplicantData = {
  resume?: string;
  skills: string[];
  education: IEducation[];
  workExperience: IWorkExperience[];
  preferredWorkType?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  languages?: string[];
  salaryExpectation?: string;
  openToWork: boolean;
};

export type IRecruiterData = {
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
};

export type IAdminData = {
  permissions: string[];
};

export type IProfile = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  role: USER_ROLES;
  firstName: string;
  lastName?: string;
  image?: string;
  phone?: string;
  bio?: string;  
  // Role-specific data
  applicantData?: IApplicantData;
  recruiterData?: IRecruiterData;
  adminData?: IAdminData;
  createdAt: Date;
  updatedAt: Date;
};