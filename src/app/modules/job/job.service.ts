import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IJobFilterables, IJob } from './job.interface';
import { Job } from './job.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { jobSearchableFields } from './job.constants';
import { Types } from 'mongoose';


const createJob = async (
  user: JwtPayload,
  payload: IJob
): Promise<IJob> => {
  try {
    const result = await Job.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Job, please try again with valid data.'
      );
    }

    return result;
  } catch (error: any) {
    
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found');
    }
    throw error;
  }
};

const getAllJobs = async (
  user: JwtPayload,
  filterables: IJobFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: jobSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Job
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }),
    Job.countDocuments(whereConditions),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleJob = async (id: string): Promise<IJob> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID');
  }

  const result = await Job.findById(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested job not found, please try again with valid id'
    );
  }

  return result;
};

const updateJob = async (
  id: string,
  payload: Partial<IJob>
): Promise<IJob | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID');
  }

  const result = await Job.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested job not found, please try again with valid id'
    );
  }

  return result;
};

const deleteJob = async (id: string): Promise<IJob> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Job ID');
  }

  const result = await Job.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting job, please try again with valid id.'
    );
  }

  return result;
};

export const JobServices = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};