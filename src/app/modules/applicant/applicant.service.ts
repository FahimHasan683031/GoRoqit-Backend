import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IApplicant } from './applicant.interface';
import { Applicant } from './applicant.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { applicantSearchableFields } from './applicant.constants';
import { Types } from 'mongoose';


const createApplicant = async (
  user: JwtPayload,
  payload: IApplicant
): Promise<IApplicant> => {
  try {
    const result = await Applicant.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Applicant, please try again with valid data.'
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

const getAllApplicants = async (
  user: JwtPayload,
  pagination: IPaginationOptions
) => {

  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);


 


  

  return {
   
    data: 'esult',
  };
};

const getSingleApplicant = async (id: string): Promise<IApplicant> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Applicant ID');
  }

  const result = await Applicant.findById(id).populate('job').populate('user');
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested applicant not found, please try again with valid id'
    );
  }

  return result;
};

const updateApplicant = async (
  id: string,
  payload: Partial<IApplicant>
): Promise<IApplicant | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Applicant ID');
  }

  const result = await Applicant.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  ).populate('job').populate('user');

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested applicant not found, please try again with valid id'
    );
  }

  return result;
};

const deleteApplicant = async (id: string): Promise<IApplicant> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Applicant ID');
  }

  const result = await Applicant.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting applicant, please try again with valid id.'
    );
  }

  return result;
};

export const ApplicantServices = {
  createApplicant,
  getAllApplicants,
  getSingleApplicant,
  updateApplicant,
  deleteApplicant,
};