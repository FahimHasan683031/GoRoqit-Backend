/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import config from '../../config'
import { IGenericErrorMessage } from '../../interfaces/error'
import handleValidationError from '../../errors/handleZodError'
import { ZodError } from 'zod'
import handleZodError from '../../errors/handleZodError'
import handleCastError from '../../errors/handleCastError'
import ApiError from '../../errors/ApiError'

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
 if (config.node_env === 'development') {
  try {
    console.error(
      'Inside Global Error Handler🪐:',
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    )
  } catch (_) {
    // fallback safe logger
    console.error('Inside Global Error Handler🪐:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })
  }
} else {
  console.error('🚨 ERROR:', error?.message)
}


  let statusCode = 500
  let message = 'Something wen wrong!'
  let errorMessages: IGenericErrorMessage[] = []

  if (error?.name === 'validationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.errorMessages[0].message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.errorMessages[0].message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error?.message
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorMessages,
    stack: config.node_env === 'production' ? undefined : error?.stack,
  })
}

export default globalErrorHandler
