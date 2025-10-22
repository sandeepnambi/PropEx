import { Request, Response, NextFunction } from 'express';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Executes the async function and catches any rejection (error), passing it to Express
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;