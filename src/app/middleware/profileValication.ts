import { Request, Response, NextFunction } from "express"
import { USER_ROLES } from "../modules/user/user.interface"
import { StatusCodes } from "http-status-codes"
import ApiError from "../../errors/ApiError"
import { RecruiterProfileUpdateSchema } from "../modules/recruiterProfile/recruiterProfile.validation"
import { ApplicantProfileUpdateSchema } from "../modules/applicantProfile/applicantProfile.validation"
import { JwtPayload } from "jsonwebtoken"
import validateRequest from "./validateRequest"

export const validateProfileUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = (req.user as JwtPayload)?.role 

    if (!role) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User role missing in request")
    }

    if (role === USER_ROLES.RECRUITER) {
      validateRequest(RecruiterProfileUpdateSchema)
      // RecruiterProfileUpdateSchema.parseAsync(req.body)
 
    } else if (role === USER_ROLES.APPLICANT) {
      ApplicantProfileUpdateSchema.parse(req.body)
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, `Profile update not allowed for role: ${role}`)
    }

    next()
  } catch (error: any) {
    next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Validation failed",
        error.errors || error.message
      )
    )
  }
}
