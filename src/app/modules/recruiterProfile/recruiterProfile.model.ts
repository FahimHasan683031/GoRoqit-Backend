import mongoose, { Schema } from "mongoose";
import { IRecruiterProfile } from "./recruiterProfile.interface";
import { calculateCompletion } from "../../../helpers/calculateProfileCompleation";
import { User } from "../user/user.model";


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