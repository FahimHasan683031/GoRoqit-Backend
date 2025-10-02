import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../user/user.interface";
import { IAdminData,IProfile, IEducation, IWorkExperience, IApplicantData, IRecruiterData,  } from "./profile.interface";


const EducationSchema = new Schema<IEducation>(
  {
    degreeTitle: { type: String, required: true },
    instituteName: { type: String, required: true },
    major: String,
    result: String,
    grade: String,
    startDate: Date,
    endDate: Date,
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
    duration: String,
  },
  { _id: false }
);

const ApplicantDataSchema = new Schema<IApplicantData>(
  {
    resume: String,
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    workExperience: { type: [WorkExperienceSchema], default: [] },
    preferredWorkType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
    },
    languages: [String],
    salaryExpectation: String,
    openToWork: { type: Boolean, default: false },
  },
  { _id: false, strict: false }
);

const RecruiterDataSchema = new Schema<IRecruiterData>(
  {
    companyName: { type: String, required: true },
    companyWebsite: String,
    companyDescription: String,
    companyLogo: String,
  },
  { _id: false, strict: false }
);

const AdminDataSchema = new Schema<IAdminData>(
  {
    permissions: { type: [String], default: [] },
  },
  { _id: false, strict: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true,
      index: true 
    },
    role: { 
      type: String, 
      enum: Object.values(USER_ROLES), 
      required: true 
    },
    firstName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: { 
      type: String, 
      trim: true,
      maxlength: 50
    },
    image: String,
    phone: String,
    bio: { 
      type: String, 
      maxlength: 500 
    },
    
    // Role-specific data
    applicantData: { type: ApplicantDataSchema },
    recruiterData: { type: RecruiterDataSchema },
    adminData: { type: AdminDataSchema },
  },
  { timestamps: true }
);

ProfileSchema.index({ role: 1 });
ProfileSchema.index({ "applicantData.skills": 1 });
ProfileSchema.index({ "applicantData.openToWork": 1 });
ProfileSchema.index({ "recruiterData.companyName": 1 });
ProfileSchema.index({ firstName: "text", lastName: "text", bio: "text" });

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);