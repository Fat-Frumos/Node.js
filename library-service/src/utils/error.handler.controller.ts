import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter
} from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    
    response.status(status).json({
      statusCode: status,
      errors: Array.isArray(errors) ? errors : [errors],
      message: "Validation failed"
    });
  }
}
