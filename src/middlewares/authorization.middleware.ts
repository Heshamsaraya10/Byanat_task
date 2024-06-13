    import { NextFunction, Request, Response } from "express";
    import asyncHandler from "express-async-handler";
    import APIError from "../utils/apiError";

    // @desc    Authorization (User Permissions)
    export const authorization = (...roles: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user?.role)) {
        return next(
            new APIError("You are not allowed to access this route", 403)
        );
        }
        next();
    });
