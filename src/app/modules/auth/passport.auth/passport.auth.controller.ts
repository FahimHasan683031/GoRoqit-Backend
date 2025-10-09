import { Request, Response } from 'express'
import catchAsync from '../../../../shared/catchAsync'
import sendResponse from '../../../../shared/sendResponse'
import { IUser } from '../../user/user.interface'
import { StatusCodes } from 'http-status-codes'
import { ILoginResponse } from '../../../../interfaces/response'
import { PassportAuthServices } from './passport.auth.service'
import { AuthCommonServices } from '../common'
import config from '../../../../config'

const login = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const { deviceToken, password } = req.body

  console.log({ deviceToken, password })

  const result = await AuthCommonServices.handleLoginLogic(
    { deviceToken: deviceToken, password: password },
    user as IUser,
  )
  const { status, message, accessToken, refreshToken, role } = result


    res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse<ILoginResponse>(res, {
    statusCode: status,
    success: true,
    message: message,
    data: { accessToken, refreshToken, role },
  })
})

const googleAuthCallback = catchAsync(async (req: Request, res: Response) => {
  console.log("Google Auth Callback", req.user)
  const result = await PassportAuthServices.handleGoogleLogin(
    req.user as IUser & { profile: any },
  )
  const { status, message, accessToken, refreshToken, role } = result
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });
  res.redirect(config.google_redirect_url ? `${config.google_redirect_url}?accessToken=${accessToken}&refreshToken=${refreshToken}&role=${role}` : "https://goroqit.com")
 
})

export const PassportAuthController = {
  login,
  googleAuthCallback,
}
