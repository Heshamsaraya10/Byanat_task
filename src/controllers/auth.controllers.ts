import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

import { MoreThan, getRepository } from "typeorm";

import APIError from "../utils/apiError";
import createToken from "../utils/createToken";
import sendEmail from "../utils/sendEmail";

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);

    // 1- Create user
    const user = userRepository.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
    });

    await userRepository.save(user);

    // 2- Generate token
    const token = createToken(user.id);
    res.status(201).json({ data: user, token });
  }
);

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Check if password and email are in the body (validation)
    if (!req.body.email || !req.body.password) {
      return next(new APIError("Please provide email and password", 400));
    }

    // 2) Check if user exists & check if password is correct
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new APIError("Incorrect email or password", 401));
    }

    // 3) Generate token
    const token = createToken(user.id);

    // 4) Send response to client side
    res.status(201).json({ data: user, token });
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user by email
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return next(
        new APIError(`There is no user with that email ${req.body.email}`, 404)
      );
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode: string = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedResetCode: string = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    // Save hashed password reset code into the database
    user.passwordResetCode = hashedResetCode;

    // Add expiration time for password reset code (10 minutes)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await userRepository.save(user);

    // 3) Send the reset code via email
    const message: string = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 min)",
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await userRepository.save(user);
      return next(new APIError("There is an error in sending email", 500));
    }

    res
      .status(200)
      .json({ status: "Success", message: "Reset code sent to email" });
  }
);

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
export const verifyPassResetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on reset code
    const hashedResetCode: string = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      return next(new APIError("Reset code invalid or expired", 400));
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    await userRepository.save(user);

    res.status(200).json({
      status: "Success",
    });
  }
);

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on email
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return next(
        new APIError(`There is no user with email ${req.body.email}`, 404)
      );
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
      return next(new APIError("Reset code not verified", 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await userRepository.save(user);

    // 3) if everything is ok, generate token
    const token = createToken(user.id);
    res.status(200).json({ token });
  }
);
