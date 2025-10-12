import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserServices } from './user.service'
import { IUser } from './user.interface'
import config from '../../../config'
import { JwtPayload } from 'jsonwebtoken'
import { IApplicantProfile } from '../applicantProfile/applicantProfile.interface'



// Update Profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateProfile(req.user! as JwtPayload, req.body)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: {result},
  })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser(req.query)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: {...result},
  })
})

// get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSingleUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  })
})

// update userRole
const updateUserRoleAndCreateProfile = catchAsync(async (req: Request, res: Response) => {
  const { role, ...profileData } = req.body

  const result = await UserServices.updateUserRoleAndCreateProfile(req.params.id, role, profileData)
  const { status, message, accessToken, refreshToken, role:Role, token } = result
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      secure: config.node_env === 'production',
      httpOnly: true,
    })
  }

  sendResponse(res, {
    statusCode: status,
    success: true,
    message: message,
    data: { accessToken, refreshToken, Role, token },
  })
})

// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteUser(req.params.id)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  })
})

// get profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getProfile(req.user! as JwtPayload)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile fetched successfully',
    data: result,
  })
})

// get applicants
const getApplicants = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getApplicants(req.query)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applicants fetched successfully',
    data: result
  })
})

// get current user
const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getCurrentUser(req.user! as JwtPayload)
  sendResponse<IUser>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  })
})

// delete profile
const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.deleteProfile(req.params.id)
  sendResponse<IApplicantProfile>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile deleted successfully',
    data: result,
  })
})



export const UserController = {
  getAllUser,
  updateProfile,
  getSingleUser,
  deleteUser,
  updateUserRoleAndCreateProfile,
  getProfile,
  getApplicants,
  getCurrentUser,
  deleteProfile
}
