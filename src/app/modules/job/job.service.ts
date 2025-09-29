import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IJob } from './job.interface'
import { Job } from './job.model'
import { JwtPayload } from 'jsonwebtoken'
import { jobSearchableFields } from './job.constants'
import { Types } from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { Category } from '../category/category.model'
import { USER_ROLES } from '../user/user.interface'
import { Application } from '../application/application.model'

const createJob = async (user: JwtPayload, payload: IJob): Promise<IJob> => {
  try {
    const checkCategory = await Category.findOne({ name: payload.category })
    if (!checkCategory) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Category not found, please try again with valid category name.',
      )
    }

    const result = await Job.create({ ...payload, user: user.authId })
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Job, please try again with valid data.',
      )
    }

    return result
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found')
    }
    throw error
  }
}

const getAllJobs = async ( query: Record<string, unknown>) => {

  const jobQueryBuilder = new QueryBuilder(Job.find(), query)
    .filter()
    .search(jobSearchableFields)
    .sort()
    .fields()
    .paginate()
    .populate([
      {
        path: 'user',
        select: 'email name role image status verified profile roleProfile',
        populate: {
          path: 'profile',
          model: 'RecruiterProfile',
          select: 'companyName companyLogo',
        },
      },
    ])

    const totalApplications = await Application.countDocuments()

  const jobs = await jobQueryBuilder.modelQuery
  const paginationInfo = await jobQueryBuilder.getPaginationInfo()

  return {
    data: jobs,
    meta: {...paginationInfo,totalApplications},
  }
}

const getSingleJob = async (id: string): Promise<IJob> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID')
  }

  const result = await Job.findById(id).populate([
      {
        path: 'user',
        select: 'email name role image status verified profile roleProfile',
        populate: {
          path: 'profile',
          model: 'RecruiterProfile'
        },
      },
    ])
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested job not found, please try again with valid id',
    )
  }

  return result
}

const updateJob = async (
  id: string,
  payload: Partial<IJob>,
): Promise<IJob | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID')
  }

  const result = await Job.findByIdAndUpdate(
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
      'Requested job not found, please try again with valid id',
    )
  }

  return result
}

const deleteJob = async (id: string): Promise<IJob> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID')
  }

  const result = await Job.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting job, please try again with valid id.',
    )
  }

  return result
}

export const JobServices = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
}
