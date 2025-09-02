import { Request, Response } from 'express';
import { ApplicantServices } from './applicant.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../../shared/pick';
import { applicantFilterables } from './applicant.constants';
import { paginationFields } from '../../../interfaces/pagination';

const createApplicant = catchAsync(async (req: Request, res: Response) => {
  const applicantData = req.body;

  const result = await ApplicantServices.createApplicant(
    req.user!,
    applicantData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Applicant created successfully',
    data: result,
  });
});

const updateApplicant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const applicantData = req.body;

  const result = await ApplicantServices.updateApplicant(id, applicantData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applicant updated successfully',
    data: result,
  });
});

const getSingleApplicant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicantServices.getSingleApplicant(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applicant retrieved successfully',
    data: result,
  });
});

const getAllApplicants = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, applicantFilterables);
  const pagination = pick(req.query, paginationFields);

  const result = await ApplicantServices.getAllApplicants(
    req.user!,
    pagination
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applicants retrieved successfully',
    data: result,
  });
});

const deleteApplicant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicantServices.deleteApplicant(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applicant deleted successfully',
    data: result,
  });
});

export const ApplicantController = {
  createApplicant,
  updateApplicant,
  getSingleApplicant,
  getAllApplicants,
  deleteApplicant,
};