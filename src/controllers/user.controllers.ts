import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";
import bcrypt from "bcrypt";

import APIError from "../utils/apiError";
import createToken from "../utils/createToken";
import { getRepository } from "typeorm";

// @desc    Create user
// @route   POST /api/v1/users
// @access  private/Admin
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, phone, role } = req.body;

  const userRepository = AppDataSource.getRepository(User);

  const user = new User();
  user.name = name;
  user.email = email;
  (user.password = await bcrypt.hash(req.body.password, 12)),
    (user.phone = phone);
  user.role = role;

  const createdUser = await userRepository.save(user);
  res.status(201).json({ status: "Success", data: createdUser });
};

//@dec    Get specific user by id
//@route  GET /api/v1/users/:id
//@access Private/admin
export const getSingleUser = async (
  req: Request,
  res: Response<{ status: string; data: User | null }>,
  next: NextFunction
) => {
  const userId = +req.params.id;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: String(userId) },
  });
  if (!user) return next(new APIError("User is not exist or Invalid ID.", 404));
  res.status(200).json({ status: "Success", data: user });
};

//  @desc    admin lists all user
//  @method  get
//  @route   /api/v1/user/
//  @access  private
export const getAllUsers = async (
  req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  const query = req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const userRepository = AppDataSource.getRepository(User);
  const allUsers = await userRepository.find({
    skip: skip,
    take: limit,
  });
  res.status(200).json(allUsers);
};

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = AppDataSource.getRepository(User);

  const userId = req.params.id;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return next(new APIError(`No document for this id ${req.params.id}`, 404));
  }

  user.name = req.body.name;
  user.slug = req.body.slug;
  user.phone = req.body.phone;
  user.email = req.body.email;
  user.profileImg = req.body.profileImg;
  user.role = req.body.role;

  await userRepository.save(user);

  res.status(200).json({ data: user });
};

//  @desc    admin deletes user
//  @method  delete
//  @route   /api/v1/user/:id
//  @access  private
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = AppDataSource.getRepository(User);

  const userId = req.params.id;

  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return next(new APIError("User does not exist or Invalid ID.", 404));
  }

  await userRepository.remove(user);

  res.json(user);
};

export const changeUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = AppDataSource.getRepository(User);

  const userId = req.params.id;

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return next(
      new APIError(`No user found for this id ${req.params.id}`, 404)
    );
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.passwordChangedAt = new Date();

  await userRepository.save(user);

  res.status(200).json({ data: user });
};

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.params.id = (req.user as { id: string }).id;
    next();
  }
);

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
export const updateLoggedUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Update user password based user payload (req.user._id)
    const userId = (req.user as { id: string }).id;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 12);
      user.passwordChangedAt = new Date();

      await userRepository.save(user);

      // 2) Generate token
      const token = createToken(user.id);

      res.status(200).json({ data: user, token });
    }
  }
);

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
export const updateLoggedUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as { _id: string })._id;
    const { name, email, phone } = req.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    user.name = name;
    user.email = email;
    user.phone = phone;

    await userRepository.save(user);

    res.status(200).json({ data: user });
  }
);

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);

    if (req.user) {
      await userRepository.update(req.user.id, { active: false });

      res.status(204).json({ status: "Success" });
    }
  }
);
