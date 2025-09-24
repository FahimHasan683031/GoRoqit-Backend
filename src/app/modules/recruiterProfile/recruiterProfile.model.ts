import mongoose, { Schema } from "mongoose";
import { IRecruiterProfile } from "./recruiterProfile.interface";


const RecruiterProfileSchema = new Schema<IRecruiterProfile>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    companyName: { type: String, required: true },
    companyWebsite: { type: String, default:null },
    companyDescription: { type: String, default:null },
    companyLogo: { type: String, default:null },
    phone: { type: String, default:null },
    companyEmail: { type: String, default:null },
    location: { type: String, default:null },
    linkedinProfile: { type: String, default:null },
    twitterProfile: { type: String, default:null },
    facebookProfile: { type: String, default:null },
    instagramProfile: { type: String, default:null },
    bio: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

RecruiterProfileSchema.index({ userId: 1 });
RecruiterProfileSchema.index({ companyName: 1 });

export const RecruiterProfile = mongoose.model<IRecruiterProfile>(
  "RecruiterProfile", 
  RecruiterProfileSchema
);