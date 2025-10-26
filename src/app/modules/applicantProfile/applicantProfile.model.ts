import mongoose, { Schema } from "mongoose";
import { IApplicantProfile, IEducation, IWorkExperience, PortfolioData } from "./applicantProfile.interface";
import { User } from "../user/user.model";
import { calculateCompletion } from "../../../helpers/calculateProfileCompleation";

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
    certificate: { type: String, default: null },
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

const PortfolioSchema = new Schema<PortfolioData>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    portfolioImages: { type: [String], default: [] },
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
    expartes: { type: [String], default: [] },
    openToWork: { type: Boolean, default: false },
    portfolio: { type: [PortfolioSchema], default: [] },
    firstName: { type: String, required: true, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    middleName: { type: String, trim: true, default: null },
    preferredName: { type: String, trim: true, default: null },
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
    yearsOfExperience: { type: String, default: null },
    landLine: { type: String, default: null },
    bio: { type: String, default: null },
  },
  { timestamps: true }
);



ApplicantProfileSchema.pre("save", async function (next) {
  const fields = [
    "resume", "skills", "preferredWorkType",
    "languages", "salaryExpectation", "expartes",  "firstName",
    "lastName",  "gender", "maritalStatus", "citizenship",
    "dateOfBirth", "streetAddress", "country", "city", "zipCode", "mobile", "bio"
  ];

  const docObject = this.toObject ? this.toObject() : this;
  (this as any)._completion = calculateCompletion(docObject, fields);
  next();
});

// Add this after your existing post-save hook
ApplicantProfileSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  
  const fields = [
    "resume", "skills",  "preferredWorkType",
    "languages", "salaryExpectation", "expartes", "firstName",
    "lastName",  "gender", "maritalStatus", "citizenship",
    "dateOfBirth", "streetAddress", "country", "city", "zipCode", "mobile", "bio"
  ];

  const docObject = doc.toObject ? doc.toObject() : doc;
  const percentage = calculateCompletion(docObject, fields);
  
  await User.findByIdAndUpdate(doc.userId, { profileCompletion: percentage });
});



ApplicantProfileSchema.index({ skills: 1 });
ApplicantProfileSchema.index({ openToWork: 1 });

export const ApplicantProfile = mongoose.model<IApplicantProfile>(
  "ApplicantProfile", 
  ApplicantProfileSchema
);