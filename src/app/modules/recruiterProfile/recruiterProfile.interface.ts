import { Types } from "mongoose";

export type PortfolioData = {
  title: string;
  description: string;
  portfolioImages: string[];
};

export type IRecruiterProfile = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogo?: string;
  phone?: string;
  companyEmail?: string;
  location?: string;
  linkedinProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  portfolio?: PortfolioData[]; 
  createdAt: Date;
  updatedAt: Date;
};