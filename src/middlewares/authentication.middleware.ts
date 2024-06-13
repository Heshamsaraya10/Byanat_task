    import { NextFunction, Request, Response } from "express";
    import jwt, { JwtPayload } from "jsonwebtoken";
    import { AppDataSource } from "../data-source";
    import asyncHandler from "express-async-handler";

    import * as dotenv from "dotenv";
    dotenv.config();

    import { User } from "../entity/User.entity";
    import APIError from "../utils/apiError";

    declare global {
    namespace Express {
        interface Request {
        user?: Record<string, any>;
        }
    }
    }

    // @desc   make sure the user is logged in
    export const authentication = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;
        if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
        ) {
        token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
        return next(
            new APIError(
            "You are not login, Please login to get access this route",
            401
            )
        );
        }
        // 2) Verify token (no change happens, expired token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

        // 3) Check if user exists
        const userRepository = AppDataSource.getRepository(User);
        const currentUser = await userRepository.findOne({
        where: { id: decoded.userId },
        });

        if (!currentUser) {
        return next(
            new APIError(
            "The user that belongs to this token no longer exists",
            401
            )
        );
        }

        // 4) Check if user change his password after token created
        if (currentUser.passwordChangedAt && decoded.iat) {
        const passChangedTimestamp: number = Math.floor(
            currentUser.passwordChangedAt.getTime() / 1000
        );

        // Password changed after token creation (Error)
        if (passChangedTimestamp > decoded.iat) {
            return next(
            new APIError(
                "User recently changed their password. Please log in again.",
                401
            )
            );
        }
        }
        req.user = currentUser;
        next();
    }
    );
