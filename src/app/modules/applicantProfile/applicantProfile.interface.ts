import { Types } from "mongoose";

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

export type IApplicantProfile = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  resume?: string;
  skills?: string[];
  education?: IEducation[];
  workExperience?: IWorkExperience[];
  preferredWorkType?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  languages?: string[];
  salaryExpectation?: string;
  openToWork: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
};