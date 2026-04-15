import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types"

export const sendSuccess = <T>(
    res: Response, 
    data: T, 
    message: string = "success", 
    statusCode: number = 200) => {
        const response: ApiResponse<T> = {
            success: true,
            data,
            message
        }
        res.status(statusCode).json(response);
};

type AsyncHandlerFn = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown> | unknown;

export const asyncHandler = (fn: AsyncHandlerFn) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}
