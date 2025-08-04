import { Request, Response, NextFunction } from 'express';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Simple validation middleware - can be enhanced later
  next();
}; 