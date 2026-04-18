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
import { User } from '../user/user.model'

const createJob = async (user: JwtPayload, payload: IJob): Promise<IJob> => {
  try {
    const isExistUser = await User.findById(user.authId)
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found!')
    }
    if (user.role !== USER_ROLES.RECRUITER) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Only Recruiters can create jobs',
      )
    }

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

const getMyJobs = async (user: JwtPayload, query: Record<string, unknown>) => {
  if (user.role !== USER_ROLES.RECRUITER) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only Recruiters can access their jobs',
    )
  }

  const jobQueryBuilder = new QueryBuilder(Job.find({ user: user.authId }), query)
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
    meta: { ...paginationInfo, totalApplications },
  }
}

const getJobsByDistance = async (user: JwtPayload, query: Record<string, unknown>) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
  }

  if (
    !isExistUser.coordinates ||
    (isExistUser.coordinates[0] === 0 && isExistUser.coordinates[1] === 0)
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please allow location access first',
    )
  }

  const { coordinates } = isExistUser

  // Utilize QueryBuilder to extract filter logic
  const jobQueryBuilder = new QueryBuilder(Job.find(), query)
    .filter()
    .search(jobSearchableFields)

  const filters = jobQueryBuilder.modelQuery.getFilter()

  const pipeline: any[] = [
    {
      $geoNear: {
        near: { type: 'Point', coordinates: coordinates },
        distanceField: 'distance',
        spherical: true,
        distanceMultiplier: 0.001,
      },
    },
  ]

  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters })
  }

  // Pagination
  const limit = Number(query.limit) || 10
  const page = Number(query.page) || 1
  const skip = (page - 1) * limit

  pipeline.push({ $skip: skip })
  pipeline.push({ $limit: limit })

  const jobs = await Job.aggregate(pipeline)

  // Populate results
  const populatedJobs = await Job.populate(jobs, [
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

  // Pagination info
  const total = await Job.countDocuments(filters)
  const totalPage = Math.ceil(total / limit)

  return {
    data: populatedJobs,
    meta: {
      total,
      limit,
      page,
      totalPage,
    },
  }
}

const getRecruiterStatistics = async (user: JwtPayload) => {
  if (user.role !== USER_ROLES.RECRUITER) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Only Recruiters can access statistics',
    )
  }

  const userId = new Types.ObjectId(user.authId)

  const stats = await Job.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        totalApplications: { $sum: '$applicationsCount' },
      },
    },
  ])

  const topJobs = await Job.find({ user: userId })
    .sort({ applicationsCount: -1 })
    .limit(3)
    .select('_id title applicationsCount')

  return {
    totalJobs: stats.length > 0 ? stats[0].totalJobs : 0,
    totalApplications: stats.length > 0 ? stats[0].totalApplications : 0,
    topJobs,
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

const deleteJob = async (user: JwtPayload, id: string): Promise<IJob> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID')
  }
  const isExistJob = await Job.findById(id)
  if (!isExistJob) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested job not found, please try again with valid id',
    )
  }

  if (user.role !== USER_ROLES.ADMIN && isExistJob.user.toString() !== user.authId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this job',
    )
  }

  const result = await Job.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested job not found while deleting job, please try again with valid id.',
    )
  }

  return result
}

export const JobServices = {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobsByDistance,
  getRecruiterStatistics,
  getSingleJob,
  updateJob,
  deleteJob,
}
