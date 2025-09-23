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
    if (user.subscribe) {
      return next();
    }

    //For non-subscribed recruiters
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJob = await Job.findOne({
      user: user._id,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    if (recentJob) {
        return next(new ApiError(
          StatusCodes.TOO_MANY_REQUESTS,
          'Job creation limited. Please subscribe to create more jobs.'
        ));
    }

    next();
  } catch (error) {
    next(error);
  }
};