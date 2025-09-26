import mongoose, { Schema } from "mongoose";
import { IApplicantProfile, IEducation, IWorkExperience } from "./applicantProfile.interface";

const EducationSchema = new Schema<IEducation>(
  {
    degreeTitle: { type: String, required: true },
    instituteName: { type: String, required: true },
    major: String,
    result: String,
    scale: String,
    duration: String,
    yearOfPassing: Number,
    cgpa: Number,
  },
  { _id: false }
);

const WorkExperienceSchema = new Schema<IWorkExperience>(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    location: String,
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
    },
    startDate: Date,
    endDate: Date,
    experience: String,
  },
  { _id: false }
);

const ApplicantProfileSchema = new Schema<IApplicantProfile>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    resume: { type: String, default: null },
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    workExperience: { type: [WorkExperienceSchema], default: [] },
    preferredWorkType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
      default: null,
    },
    languages: { type: [String], default: [] },
    salaryExpectation: { type: String, default: null },
    openToWork: { type: Boolean, default: false },
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    middleName: { type: String, trim: true, maxlength: 50 },
    preferredName: { type: String, trim: true, maxlength: 50 },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], default: null },
    citizenship: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    age: { type: Number, default: null },
    previousEmployment: { type: String, enum: ["Yes", "No"], default: null },
    streetAddress: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    zipCode: { type: String, default: null },
    province: { type: String, default: null },
    mobile: { type: String, default: null },
    landLine: { type: String, default: null },
    bio: { type: String, maxlength: 500, default: null },
  },
  { timestamps: true }
);

ApplicantProfileSchema.index({ userId: 1 });
ApplicantProfileSchema.index({ skills: 1 });
ApplicantProfileSchema.index({ openToWork: 1 });

export const ApplicantProfile = mongoose.model<IApplicantProfile>(
  "ApplicantProfile", 
  ApplicantProfileSchema
);