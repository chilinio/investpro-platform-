import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

interface ValidationError {
  msg: string;
  param: string;
  location: string;
  value?: any;
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  }

  next();
};

// Helper function to create validation middleware
export const createValidationMiddleware = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    validateRequest(req, res, next);
  };
}; 