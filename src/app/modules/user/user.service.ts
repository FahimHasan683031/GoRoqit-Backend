import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IUpdateProfilePayload, IUser } from './user.interface'
import { User } from './user.model'
import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import { IEducation, IProfile } from '../profile/profile.interface'
import { Profile } from '../profile/profile.model'
import { authResponse } from '../auth/common'
import { AuthHelper } from '../auth/auth.helper'
import { ApplicantProfile } from '../applicantProfile/applicantProfile.model'
import { RecruiterProfile } from '../recruiterProfile/recruiterProfile.model'
import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../../config'
import { PortfolioData } from '../applicantProfile/applicantProfile.interface'

const createAdmin = async (): Promise<Partial<IUser> | null> => {
  const admin = {
    email: config.super_admin.email,
    name: config.super_admin.name,
    password: config.super_admin.password,
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
  logger.log('info', 'Admin account created successfully.')
  return result[0]
}

const getAllUser = async (query: Record<string, unknown>) => {
  const userQueryBuilder = new QueryBuilder(User.find(), query)
    .filter()
    .sort()
    .fields()
    .paginate()

  const users = await userQueryBuilder.modelQuery.lean()
  const paginationInfo = await userQueryBuilder.getPaginationInfo()

  const totalUsers = await User.countDocuments()

  const totalRecruiters = await User.countDocuments({
    role: USER_ROLES.RECRUITER,
  })

  const totalApplicants = await User.countDocuments({
    role: USER_ROLES.APPLICANT,
  })

  const staticData = { totalUsers, totalRecruiters, totalApplicants }

  return {
    users,
    staticData,
    meta: paginationInfo,
  }
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
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (user.role === USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin cannot be deleted')
  }
  const result = await User.findByIdAndDelete(id)
  if (user.role === USER_ROLES.APPLICANT) {
    await ApplicantProfile.findByIdAndDelete(user.profile)
  } else if (user.role === USER_ROLES.RECRUITER) {
    await RecruiterProfile.findByIdAndDelete(user.profile)
  }
  return result
}

export const updateProfile = async (
  user: JwtPayload,
  payload: IUpdateProfilePayload,
) => {
  const isExistUser = await User.findById(user.authId)

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or deleted.')
  }

  // 1. Update User basic fields (NO EMAIL update allowed)
  const updatedUser = await User.findOneAndUpdate(
    { _id: user.authId, status: { $ne: USER_STATUS.DELETED } },
    {
      ...(payload.name && { name: payload.name }),
      ...(payload.firstName && { name: payload.firstName }),
      ...(payload.firstName &&
        payload.lastName && {
          name: payload.firstName + ' ' + payload.lastName,
        }),
      ...(payload.firstName &&
        payload.lastName &&
        payload.middleName && {
          name:
            payload.firstName +
            ' ' +
            payload.middleName +
            ' ' +
            payload.lastName,
        }),
      ...(payload.image && { image: payload.image }),
    },
    { new: true },
  )

  // 2. Update role-based profile
  if (isExistUser.role === USER_ROLES.APPLICANT && isExistUser.profile) {
    if (payload.openToWork && isExistUser.profileCompletion! < 60) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please complete your profile first!',
      )
    }
    const res = await ApplicantProfile.findByIdAndUpdate(
      isExistUser.profile,
      payload,
      { new: true },
    )
    // return "Profile updated successfully.";
    return res
  } else if (isExistUser.role === USER_ROLES.RECRUITER && isExistUser.profile) {
    const res = await RecruiterProfile.findByIdAndUpdate(
      isExistUser.profile,
      payload,
      { new: true },
    )
    // return "Profile updated successfully.";
    return res
  } else {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Something went wrong.')
  }
}

// add applicant portfolio
const addApplicantPortfolio = async (
  user: JwtPayload,
  portfolioData: PortfolioData,
) => {
  if (user.role === USER_ROLES.APPLICANT) {
    const profile = await ApplicantProfile.findOne({ userId: user.authId })
    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found')
    }
    profile.portfolio?.push(portfolioData)
    return await profile.save()
  } else if (user.role === USER_ROLES.RECRUITER) {
    const profile = await RecruiterProfile.findOne({ userId: user.authId })
    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Recruiter profile not found')
    }
    profile.portfolio?.push(portfolioData)
    return await profile.save()
  }
}

const removeApplicantPortfolio = async (user: JwtPayload, title: string) => {
  if (user.role === USER_ROLES.APPLICANT) {
    const profile = await ApplicantProfile.findOne({ userId: user.authId })
    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found')
    }
    profile.portfolio = profile.portfolio?.filter(item => item.title !== title)
    return await profile.save()
  } else if (user.role === USER_ROLES.RECRUITER) {
    const profile = await RecruiterProfile.findOne({ userId: user.authId })
    if (!profile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Recruiter profile not found')
    }
    profile.portfolio = profile.portfolio?.filter(item => item.title !== title)
    return await profile.save()
  }
}
const adApplicantEducation = async (
  user: JwtPayload,
  educationData: IEducation,
) => {
  const profile = await ApplicantProfile.findOne({ userId: user.authId })
  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found')
  }
  profile.education?.push(educationData)
  return await profile.save()
}

const removeApplicantEducation = async (user: JwtPayload, title: string) => {
  const profile = await ApplicantProfile.findOne({ userId: user.authId })
  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Applicant profile not found')
  }
  profile.education = profile.education?.filter(
    item => item.degreeTitle !== title,
  )
  return await profile.save()
}

const getProfile = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId)
    .populate('profile')
    .lean()
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The requested profile not found or deleted.',
    )
  }
  return isExistUser
}

const getCurrentUser = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The requested profile not found or deleted.',
    )
  }
  return isExistUser
}

const getApplicants = async (query: Record<string, unknown>) => {
  const applicantQueryBuilder = new QueryBuilder(
    ApplicantProfile.find({ openToWork: true }),
    query,
  )
    .search([
      'firstName',
      'lastName',
      'preferredName',
      'skills',
      'city',
      'country',
    ])
    .filter()
    .sort()
    .fields()
    .paginate()
    .populate(['userId'], {
      userId: 'email name role image status verified',
    })

  const applicants = await applicantQueryBuilder.modelQuery.lean()
  const paginationInfo = await applicantQueryBuilder.getPaginationInfo()

  return {
    data: applicants,
    meta: paginationInfo,
  }
}

const deleteMyAccount = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The requested profile not found or deleted.',
    )
  }
  if (isExistUser.role === USER_ROLES.APPLICANT && isExistUser.profile) {
    const res = await ApplicantProfile.findByIdAndDelete(isExistUser.profile)
    if (res) {
      await User.findByIdAndDelete(isExistUser._id)
    }
  } else if (isExistUser.role === USER_ROLES.RECRUITER && isExistUser.profile) {
    const res = await RecruiterProfile.findByIdAndDelete(isExistUser.profile)
    if (res) {
      await User.findByIdAndDelete(isExistUser._id)
    }
  }
  return 'Account deleted successfully'
}

export const UserServices = {
  updateProfile,
  updateUserRoleAndCreateProfile,
  createAdmin,
  getAllUser,
  getSingleUser,
  deleteUser,
  getProfile,
  getApplicants,
  getCurrentUser,
  deleteMyAccount,
  addApplicantPortfolio,
  removeApplicantPortfolio,
  adApplicantEducation,
  removeApplicantEducation,
}
