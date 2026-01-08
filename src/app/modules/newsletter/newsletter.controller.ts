import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { INewsletter } from "./newsletter.interface";
import { newsletterService } from "./newsletter.service";
import { StatusCodes } from "http-status-codes";

const createNewsletter = catchAsync(async (req: Request, res: Response) => {
  const newsletterData: INewsletter = req.body;

  const result = await newsletterService.createNewsletter(
    newsletterData
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Newsletter created successfully',
    data: result,
  });
});

const getAllNewsletters = catchAsync(async (req: Request, res: Response) => {
  const result = await newsletterService.getAllNewsletters(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Newsletters retrieved successfully',
    data: result,
  });
});

const deleteNewsletter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await newsletterService.deleteNewsletter(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Newsletter deleted successfully',
    data: result,
  });
});

const deleteAllNewsletters = catchAsync(async (req: Request, res: Response) => {
  const result = await newsletterService.deleteAllNewsletters();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All newsletters deleted successfully',
    data: result,
  });
});


export const newsletterController = {
  createNewsletter,
  getAllNewsletters,
  deleteNewsletter,
  deleteAllNewsletters,
}