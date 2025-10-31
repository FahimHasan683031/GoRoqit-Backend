import { Request, Response } from 'express';
import { JobServices } from './job.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { jobFilterables } from './job.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createJob = catchAsync(async (req: Request, res: Response) => {
  const jobData = req.body;

  const result = await JobServices.createJob(
    req.user!,
    jobData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Job created successfully',
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const jobData = req.body;

  const result = await JobServices.updateJob(id, jobData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Job updated successfully',
    data: result,
  });
});

const getSingleJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobServices.getSingleJob(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, jobFilterables);
  const pagination = pick(req.query, paginationFields);
  console.log(filterables)

  const result = await JobServices.getAllJobs(
   req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await JobServices.deleteJob(req.user!, id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});

export const JobController = {
  createJob,
  updateJob,
  getSingleJob,
  getAllJobs,
  deleteJob,
};