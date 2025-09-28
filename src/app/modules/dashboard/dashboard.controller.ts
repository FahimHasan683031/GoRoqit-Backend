import { StatusCodes } from "http-status-codes"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { DashboardServices } from "./dashboard.service"
import { Request, Response } from 'express';

const getDashboardStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getDashboardStatistics(req.query.year as string)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: result,
  })
})


export const DashboardControllers = {
  getDashboardStatistics,
}