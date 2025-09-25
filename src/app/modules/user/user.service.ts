import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IUpdateProfilePayload, IUser } from './user.interface'
import { User } from './user.model'
import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import { IProfile } from '../profile/profile.interface'
import { Profile } from '../profile/profile.model'
import { authResponse } from '../auth/common'
import { AuthHelper } from '../auth/auth.helper'
import { ApplicantProfile } from '../applicantProfile/applicantProfile.model'
import { RecruiterProfile } from '../recruiterProfile/recruiterProfile.model'


const createAdmin = async (): Promise<Partial<IUser> | null> => {
  const admin = {
    email: 'web.mohosin@gmail.com',
    name: 'Md Mohosin',
    password: '12345678',
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    verified: true,
    authentication: {
      oneTimeCode: null,
      restrictionLeftAt: null,
      expiresAt: null,
      latestRequestAt: new Date(),
      authType: '',
    },
  }

  const isAdminExist = await User.findOne({
    email: admin.email,
    status: { $nin: [USER_STATUS.DELETED] },
  })

  if (isAdminExist) {
    logger.log('info', 'Admin account already exist, skipping creation.')
    return isAdminExist
  }
  const result = await User.create([admin])
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
  }
  return result[0]
}

const getAllUser = async () => {
  const result = await User.find()
  return result
}

const getSingleUser = async (id: string) => {
  const result = await User.findById(id).populate('profile')
  return result
}

// update userRole
const updateUserRoleAndCreateProfile = async (
  id: string,
  role: string,
  profileData: Partial<IProfile>,
) => {
  console.log('updateUserRoleAndCreateProfile', id, role, profileData)
  console.log('role', role)
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (user.role !== 'guest') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Role already updated')
  }

  const profile = await Profile.create({
    userId: user._id,
    role,
    ...profileData,
  })

  const result = await User.findByIdAndUpdate(
    id,
    { role, profile: profile._id },
    { new: true },
  )
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to update user role and create profile',
    )
  }
  const tokens = AuthHelper.createToken(
    result._id,
    result.role,
    result.name,
    result.email,
  )
  return authResponse(
    StatusCodes.OK,
    `Welcome ${result.name} to our platform.`,
    result.role,
    tokens.accessToken,
    tokens.refreshToken,
  )
}

// delete User
const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id)
  return result
}


export const updateProfile = async (user:JwtPayload, payload: IUpdateProfilePayload) => {
 
  const isExistUser = await User.findById(user.authId)

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found or deleted.");
  }
  if (user.role !== isExistUser.role) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "you dont have permission to update profile.");
  }
  
  // 1. Update User basic fields (NO EMAIL update allowed)
  const updatedUser = await User.findOneAndUpdate(
    { _id: user.authId, status: { $ne: USER_STATUS.DELETED } },
    {
      ...(payload.name && { name: payload.name }),
      ...(payload.image && { image: payload.image }),
    },
    { new: true }
  );

  
  // 2. Update role-based profile
  if (isExistUser.role === USER_ROLES.APPLICANT && isExistUser.profile) {
    await ApplicantProfile.findByIdAndUpdate(
      isExistUser.profile,
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
        ...(payload.middleName && { middleName: payload.middleName }),
        ...(payload.preferredName && { preferredName: payload.preferredName }),
        ...(payload.gender && { gender: payload.gender }),
        ...(payload.maritalStatus && { maritalStatus: payload.maritalStatus }),
        ...(payload.citizenship && { citizenship: payload.citizenship }),
        ...(payload.dateOfBirth && { dateOfBirth: payload.dateOfBirth }),
        ...(payload.age && { age: payload.age }),
        ...(payload.previousEmployment && { previousEmployment: payload.previousEmployment }),
        ...(payload.compiteAddrase && { compiteAddrase: payload.compiteAddrase }),
        ...(payload.country && { country: payload.country }),
        ...(payload.city && { city: payload.city }),
        ...(payload.zipCode && { zipCode: payload.zipCode }),

      },
      { new: true }
    );
    return "Profile updated successfully.";
  } else if (isExistUser.role === USER_ROLES.RECRUITER && isExistUser.profile) {
    await RecruiterProfile.findByIdAndUpdate(
      isExistUser.profile,
      {
        ...(payload.companyName && { companyName: payload.companyName }),
        ...(payload.companyWebsite && { companyWebsite: payload.companyWebsite }),
        ...(payload.companyDescription && { companyDescription: payload.companyDescription }),
        ...(payload.companyLogo && { companyLogo: payload.companyLogo }),
        ...(payload.companyEmail && { companyEmail: payload.companyEmail }),
        ...(payload.location && { location: payload.location }),
        ...(payload.linkedinProfile && { linkedinProfile: payload.linkedinProfile }),
        ...(payload.twitterProfile && { twitterProfile: payload.twitterProfile }),
        ...(payload.facebookProfile && { facebookProfile: payload.facebookProfile }),
        ...(payload.instagramProfile && { instagramProfile: payload.instagramProfile }),
      },
      { new: true }
    );
    return "Profile updated successfully.";
  }else{
    throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong.");
  }
};

const getProfile = async(user:JwtPayload) => {
  console.log('getProfile user', user)
  const isExistUser = await User.findById(user.authId).populate('profile').lean()
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, "The requested profile not found or deleted.");
  }
  return isExistUser
}


export const UserServices = {
  updateProfile,
  updateUserRoleAndCreateProfile,
  createAdmin,
  getAllUser,
  getSingleUser,
  deleteUser,
  getProfile,
}
