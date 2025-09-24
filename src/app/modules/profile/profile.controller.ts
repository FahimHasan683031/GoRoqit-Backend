import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { profileServices } from "./profile.service"
import sendResponse from "../../../shared/sendResponse"
import { StatusCodes } from "http-status-codes"
import { IProfile } from "./profile.interface"
import { JwtPayload } from "jsonwebtoken"

// Create Profile
const createProfile = catchAsync(async (req: Request, res: Response) => {
  const { image, ...userData } = req.body

  image && (userData.profile = image[0])
  const result = await profileServices.CreateOrUpdataeProfile(req.user!, userData)
  sendResponse<IProfile>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile created successfully',
    data: result,
  })
})

// Get all profile
const getAllProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await profileServices.GetAllProfile()
  sendResponse<IProfile[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  })
})

// Get Profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await profileServices.GetProfile(req.user!)
  sendResponse<IProfile>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  })
})

// Update Profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { image, ...userData } = req.body

  image && (userData.image = image[0])
  const result = await profileServices.UpdateProfile({ authId: (req.user! as JwtPayload).authId!, ...userData })
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: {result},
  })
})



export const profileControllers = {
  createProfile,
  getProfile,
  updateProfile,
  getAllProfile,
}