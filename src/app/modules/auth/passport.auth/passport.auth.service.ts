import { USER_STATUS } from '../../../../enum/user'
import { ILoginData } from '../../../../interfaces/auth'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../../errors/ApiError'
import { User } from '../../user/user.model'

import { IUser, USER_ROLES } from '../../user/user.interface'
import { AuthHelper } from '../auth.helper'
import { IAuthResponse } from '../auth.interface'
import { authResponse } from '../common'
import { ApplicantProfile } from '../../applicantProfile/applicantProfile.model'

const handleGoogleLogin = async (payload: IUser & { profile: any }): Promise<IAuthResponse> => {
  const { emails, photos, displayName, id } = payload.profile
  const email = emails[0].value.toLowerCase().trim()
  const isUserExist = await User.findOne({
    email,
    status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
  })
  if (isUserExist) {
    //return only the token
    const tokens = AuthHelper.createToken(isUserExist._id, isUserExist.role)
    return authResponse(StatusCodes.OK, `Welcome ${isUserExist.name} to our platform.`, isUserExist.role, tokens.accessToken, tokens.refreshToken)
  }

  const session = await User.startSession()
  session.startTransaction()

  const userData = {
    email: emails[0].value,
    name: displayName,
    verified: true,
    password: id,
    image: photos[0].value,
    status: USER_STATUS.ACTIVE,
    role: USER_ROLES.APPLICANT,
  }

  try {
    const user = await User.create([userData], { session })
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user')
    }
    const createdUser = user[0]

     const names = displayName.split(' ')
      const profile = await ApplicantProfile.create([{ userId: createdUser._id, firstName: names[0], lastName: names[1] }], { session });
      if (!profile[0]) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create applicant profile.");

      const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        { roleProfile: "ApplicantProfile", profile: profile[0]._id },
        { new: true, session }
      );

    //create token
    const tokens = AuthHelper.createToken(createdUser._id, createdUser.role)

    await session.commitTransaction()
    await session.endSession()

    return authResponse(StatusCodes.OK, `Welcome ${createdUser.name} to our platform.`, createdUser.role, tokens.accessToken, tokens.refreshToken)
  } catch (error) {
    await session.abortTransaction(session)
    session.endSession()
    throw error
  } finally {
    await session.endSession()
  }
}

export const PassportAuthServices = {
  handleGoogleLogin,
}