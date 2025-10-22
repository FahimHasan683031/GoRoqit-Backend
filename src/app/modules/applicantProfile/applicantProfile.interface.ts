import { Types } from "mongoose";

export type IEducation = {
  degreeTitle: string;
  instituteName: string;
  major?: string;
  result?: string;
  scale?: string;
  duration?: string;
  yearOfPassing?: number;
  cgpa?: number;
  certificate?: string;
};

export type IWorkExperience = {
  jobTitle: string;
  companyName: string;
  location?: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  startDate?: Date;
  endDate?: Date;
  experience?: string;
};

export type IApplicantProfile = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  expartes?: string[];
  resume?: string;
  skills?: string[];
  education?: IEducation[];
  workExperience?: IWorkExperience[];
  preferredWorkType?: "Full-time" | "Part-time" | "Contract" | "Internship" | "Other";
  languages?: string[];
  salaryExpectation?: string;
  openToWork: boolean;
  firstName?: string;
  middleName?: string;
  preferredName?: string;
  lastName?: string;
  gender?: "Male" | "Female" | "Other";
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  citizenship?: string;
  dateOfBirth?: Date;
  age?: number;
  previousEmployment?:"Yes"|"No";
  streetAddress?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  province?: string;
  yearsOfExperience?: string;
  mobile?: string;
  landLine?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
};