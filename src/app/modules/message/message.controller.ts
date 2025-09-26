import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { MessageService } from './message.service';
import { JwtPayload } from 'jsonwebtoken';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
   req.body.sender =(req.user as JwtPayload).authId
  const message = await MessageService.sendMessageToDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Send Message Successfully',
    data: message,
  });
});

const getMessage = catchAsync(async (req: Request, res: Response) => {
  const messages = await MessageService.getMessageFromDB(req.params.id, req.user!, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Message Retrieve Successfully',
    data: messages,
  });
});

const updateMessage = catchAsync(async (req: Request, res: Response) => {
  const message = await MessageService.updateMessage(req.params.id,req.user!, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Message Update Successfully',
    data: message,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const message = await MessageService.deleteMessage(req.params.id,req.user!,);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Message Delete Successfully',
    data: message,
  });
});


export const MessageController = { 
  sendMessage,
   getMessage,
   updateMessage,
   deleteMessage
   };
