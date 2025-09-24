import { JwtPayload } from "jsonwebtoken"
import { IProfile } from "./profile.interface"
import { Profile } from "./profile.model"
import mongoose from "mongoose";
import { User } from "../user/user.model";
import { IUpdateProfilePayload, USER_ROLES, USER_STATUS } from "../user/user.interface";
import { getStatusCode, StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { RecruiterProfile } from "../recruiterProfile/recruiterProfile.model";
import { ApplicantProfile } from "../applicantProfile/applicantProfile.model";


// Create Profile
const CreateOrUpdataeProfile= async (user:JwtPayload,payload: IProfile): Promise<IProfile | null> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
     payload.userId = user.authId;
      // Check if user exists
      const isExistUser = await User.findById(user.authId).session(session);
      console.log('CreateOrUpdataeProfile', isExistUser)     
       if (!isExistUser) {
        throw new Error("User not found");
      }
      if(isExistUser.role !== payload.role){
        throw new Error("Role can't be updated")
      }
      // Check if profile exists
      let profile = await Profile.findOne({ userId:user.authId }).session(session);

      if (profile) {
        // Update profile fields
        profile = await Profile.findByIdAndUpdate(profile._id, payload, {
          new: true,
          runValidators: true,
          session,
        });
      }

      // Commit transaction
      await session.commitTransaction();
      return profile;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }


// Get all profile
const GetAllProfile=async ()=>{
  const res = await Profile.find().populate('userId')
  return res
}

// Get Profile
const GetProfile=async (user:JwtPayload)=>{
  const res = await Profile.findOne({userId:user.authId}).populate('userId')
  return res
}


export const UpdateProfile = async (payload: IUpdateProfilePayload) => {
  // 1. Update User basic fields (NO EMAIL update allowed)
  const user = await User.findOneAndUpdate(
    { _id: payload.authId, status: { $ne: USER_STATUS.DELETED } },
    {
      ...(payload.name && { name: payload.name }),
      ...(payload.phone && { phone: payload.phone }),
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found or deleted.");
  }

  // 2. Update role-based profile
  if (user.role === USER_ROLES.APPLICANT && user.profile) {
    await ApplicantProfile.findByIdAndUpdate(
      user.profile,
      {
        ...(payload.firstName && { firstName: payload.firstName }),
        ...(payload.lastName && { lastName: payload.lastName }),
        ...(payload.resume && { resume: payload.resume }),
        ...(payload.skills && { skills: payload.skills }),
        ...(payload.education && { education: payload.education }),
        ...(payload.workExperience && { workExperience: payload.workExperience }),
        ...(payload.preferredWorkType && { preferredWorkType: payload.preferredWorkType }),
        ...(payload.languages && { languages: payload.languages }),
        ...(payload.salaryExpectation && { salaryExpectation: payload.salaryExpectation }),
        ...(payload.openToWork !== undefined && { openToWork: payload.openToWork }),
        ...(payload.bio && { bio: payload.bio }),
      },
      { new: true }
    );
  } else if (user.role === USER_ROLES.RECRUITER && user.profile) {
    await RecruiterProfile.findByIdAndUpdate(
      user.profile,
      {
        ...(payload.firstName && { firstName: payload.firstName }),
        ...(payload.lastName && { lastName: payload.lastName }),
        ...(payload.companyName && { companyName: payload.companyName }),
        ...(payload.companyWebsite && { companyWebsite: payload.companyWebsite }),
        ...(payload.companyDescription && { companyDescription: payload.companyDescription }),
        ...(payload.bio && { bio: payload.bio }),
      },
      { new: true }
    );
  }

  return "Profile updated successfully.";
};




export const profileServices = { 
  CreateOrUpdataeProfile,
  GetProfile,
  UpdateProfile,
  GetAllProfile
  }
