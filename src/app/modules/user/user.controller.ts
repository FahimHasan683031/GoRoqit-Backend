import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserServices } from './user.service'
import { IUser } from './user.interface'
import config from '../../../config'
import { JwtPayload } from 'jsonwebtoken'



// Update Profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { image, ...userData } = req.body

  image && (userData.image = image[0])
  const result = await UserServices.updateProfile({ authId: (req.user! as JwtPayload).authId!, ...userData })
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: {result},
  })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser()
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
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



export const UserController = {
  getAllUser,
  updateProfile,
  getSingleUser,
  deleteUser,
  updateUserRoleAndCreateProfile
}
