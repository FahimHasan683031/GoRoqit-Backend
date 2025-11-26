import mongoose, { Schema } from "mongoose";
import { IApplicantProfile, IEducation, IWorkExperience, PortfolioData } from "./applicantProfile.interface";
import { User } from "../user/user.model";
import { calculateCompletion } from "../../../helpers/calculateProfileCompleation";

const EducationSchema = new Schema<IEducation>(
  {
    degreeTitle: { type: String, required: true },
    instituteName: { type: String, required: true },
    major: { type: String, required: false },
    duration: { type: String, required: false },
    yearOfPassing: { type: String, required: false },
    description: { type: String, required: false },
    certificate: { type: [String], default: [] },
  },
  { _id: false }
);

const WorkExperienceSchema = new Schema<IWorkExperience>(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: false },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Temp", "Self-employed", "Chair-rental"],
      required: false,
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    experience: { type: String, required: false },
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
    resume: { type: String, required: false },
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    workExperience: { type: [WorkExperienceSchema], default: [] },
    preferredWorkType: {
      type: String,
      enum: ["Full-time", "Part-time", "Temp", "Self-employed", "Chair-rental"],
      required: false,
    },
    languages: { type: [String], default: [] },
    salaryExpectation: {
      type: {
        type: String,
        enum: ["yearly", "monthly", "weekly", "hourly"],
        required: false,
      },
      amount: { type: Number, required: false },
    },
    expartes: { type: [String], default: [] },
    openToWork: { type: Boolean, default: false },
    portfolio: { type: [PortfolioSchema], default: [] },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, required: false },
    middleName: { type: String, trim: true, required: false },
    preferredName: { type: String, trim: true, required: false },
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Other"], 
      required: false 
    },
    maritalStatus: { 
      type: String, 
      enum: ["Single", "Married", "Divorced", "Widowed"], 
      required: false 
    },
    citizenship: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false },
    previousEmployment: { 
      type: String, 
      enum: ["Yes", "No"], 
      required: false 
    },
    streetAddress: { type: String, required: false },
    country: { type: String, required: false },
    city: { type: String, required: false },
    zipCode: { type: String, required: false },
    mobile: { type: String, required: false },
    yearsOfExperience: { type: String, required: false },
    landLine: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

ApplicantProfileSchema.pre("save", async function (next) {
  const fields = [
    "resume", "skills", "preferredWorkType",
    "languages", "salaryExpectation", "expartes", "firstName",
    "lastName", "gender", "maritalStatus", "citizenship",
    "dateOfBirth", "streetAddress", "country", "city", "zipCode", "mobile", "bio"
  ];

  const docObject = this.toObject ? this.toObject() : this;
  (this as any)._completion = calculateCompletion(docObject, fields);
  next();
});

ApplicantProfileSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  
  const fields = [
    "resume", "skills", "preferredWorkType",
    "languages", "salaryExpectation", "expartes", "firstName",
    "lastName", "gender", "maritalStatus", "citizenship",
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