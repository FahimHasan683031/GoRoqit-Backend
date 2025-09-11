import { JwtPayload } from "jsonwebtoken"
import { IProfile } from "./profile.interface"
import { Profile } from "./profile.model"
import mongoose from "mongoose";
import { User } from "../user/user.model";


// Create Profile
const CreateOrUpdataeProfile= async (user:JwtPayload,payload: IProfile): Promise<IProfile | null> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
     payload.userId = user.authId;

      // Check if user exists
      const isExistUser = await User.findById(user.authId).session(session);
      if (!isExistUser) {
        throw new Error("User not found");
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
      } else {
        const newProfile = await Profile.create([payload], { session });
        console.log(newProfile)
        profile = newProfile[0];

        // Update user.profile

       await  User.findByIdAndUpdate(user.authId,{profile:newProfile[0]._id},{session})



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
// Update Profile
const UpdateProfile=async (user:JwtPayload,payload:Partial<IProfile>)=>{
  const res = await Profile.findOneAndUpdate({userId:user.authId},payload,{new:true})
  return res
}



export const profileServices = { 
  CreateOrUpdataeProfile,
  GetProfile,
  UpdateProfile,
  GetAllProfile
  }
