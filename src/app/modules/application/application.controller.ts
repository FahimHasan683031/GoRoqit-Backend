import { Request, Response } from 'express';
import { ApplicationServices } from './application.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';


const createApplication = catchAsync(async (req: Request, res: Response) => {
  const ApplicationData = req.body;
  const result = await ApplicationServices.createApplication(
    req.user!,
    ApplicationData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Application created successfully',
    data: result,
  });
});

const updateApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ApplicationData = req.body;

  const result = await ApplicationServices.updateApplication(id, ApplicationData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application updated successfully',
    data: result,
  });
});

const getSingleApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicationServices.getSingleApplication(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application retrieved successfully',
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {

  const result = await ApplicationServices.getAllApplications(
    req.user!,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ApplicationServices.deleteApplication(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Application deleted successfully',
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  updateApplication,
  getSingleApplication,
  getAllApplications,
  deleteApplication,
};