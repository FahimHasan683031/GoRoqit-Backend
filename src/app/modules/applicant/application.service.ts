import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IApplication } from './application.interface'
import { Application } from './application.model'
import { JwtPayload } from 'jsonwebtoken'
import mongoose, { Types } from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { Job } from '../job/job.model'

export const createApplication = async (
  user: JwtPayload,
  payload: IApplication,
): Promise<IApplication> => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const job = await Job.findById(payload.job)
    if (!job) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Job doesn't exist!")
    }

    const createdApplication = await Application.create(
      [{ ...payload, user: user.authId }],
      { session },
    )

    if (!createdApplication || createdApplication.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Application, please try again with valid data.',
      )
    }

    const application = createdApplication[0]

    const updatedJob = await Job.findByIdAndUpdate(
      application.job,
      { $inc: { applicationsCount: 1 } },
      { new: true, session },
    )

    if (!updatedJob) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to update job application count',
      )
    }

    await session.commitTransaction()

    return application
  } catch (error: any) {
    await session.abortTransaction()

    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found')
    }

    throw error
  } finally {
    session.endSession()
  }
}

const getAllApplications = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const applicationQuery = new QueryBuilder(
    Application.find({ user: user.authId }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
  const jobs = await applicationQuery.modelQuery
  return jobs
}

const getSingleApplication = async (id: string): Promise<IApplication> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID')
  }

  const result = await Application.findById(id).populate('job').populate('user')
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested Application not found, please try again with valid id',
    )
  }

  return result
}

const updateApplication = async (
  id: string,
  payload: Partial<IApplication>,
): Promise<IApplication | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID')
  }

  const result = await Application.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested Application not found, please try again with valid id',
    )
  }

  return result
}

const deleteApplication = async (id: string): Promise<IApplication> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Application ID')
  }

  const result = await Application.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting Application, please try again with valid id.',
    )
  }

  return result
}

export const ApplicationServices = {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
}
