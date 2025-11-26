import mongoose, { Schema } from "mongoose";
import { IRecruiterProfile, PortfolioData } from "./recruiterProfile.interface";
import { calculateCompletion } from "../../../helpers/calculateProfileCompleation";
import { User } from "../user/user.model";

const PortfolioSchema = new Schema<PortfolioData>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    portfolioImages: { type: [String], default: [] },
  },
  { _id: false }
);

const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    companyName: { type: String, required: true },
    companyWebsite: { type: String, required: false },
    companyDescription: { type: String, required: false },
    companyLogo: { type: String, required: false },
    phone: { type: String, required: false },
    companyEmail: { type: String, required: false },
    location: { type: String, required: false },
    linkedinProfile: { type: String, required: false },
    twitterProfile: { type: String, required: false },
    facebookProfile: { type: String, required: false },
    portfolio: { type: [PortfolioSchema], default: [] },
    instagramProfile: { type: String, required: false },
  },
  { timestamps: true }
);

RecruiterProfileSchema.pre("save", async function (next) {
  const fields = [
    "companyName", "companyWebsite", "companyDescription", "companyLogo",
    "phone", "companyEmail", "location", "linkedinProfile", "twitterProfile",
    "facebookProfile", "instagramProfile", "bio"
  ];

  const docObject = this.toObject ? this.toObject() : this;
  (this as any)._completion = calculateCompletion(docObject, fields);
  next();
});

RecruiterProfileSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  
  const fields = [
    "companyName", "companyWebsite", "companyDescription", "companyLogo",
    "phone", "companyEmail", "location", "linkedinProfile", "twitterProfile",
    "facebookProfile", "instagramProfile", "bio"
  ];

  const docObject = doc.toObject ? doc.toObject() : doc;
  const percentage = calculateCompletion(docObject, fields);
  
  await User.findByIdAndUpdate(doc.userId, { profileCompletion: percentage });
});

RecruiterProfileSchema.index({ companyName: 1 });

export const RecruiterProfile = mongoose.model<IRecruiterProfile>(
  "RecruiterProfile", 
  RecruiterProfileSchema
);