import { Request, Response, NextFunction } from 'express';
import { Job } from '../modules/job/job.model';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../modules/user/user.model';
import { JwtPayload } from 'jsonwebtoken';




export const validateJobCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Check user exists and is recruiter
    const user = await User.findById((req.user as JwtPayload)?.authId);
    if (!user || user.role !== 'recruiter') {
        return next(new ApiError(
              StatusCodes.FORBIDDEN,
              "Access denied. Only recruiters can create jobs."
            ));
    }

    //Check subscription status
    if (!user.subscribe) {
      return next(new ApiError(
          StatusCodes.TOO_MANY_REQUESTS,
          'you need to purchase one of our subscription plans to post a job.'
        ));
      
    }else if(user.subscribe) {
      return next();
    }else{
      return next(new ApiError(
        StatusCodes.FORBIDDEN,
        "Access denied. Only subscribed recruiters can create jobs."
      ));
    }
  } catch (error) {
    next(error);
  }
};