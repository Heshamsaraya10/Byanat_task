import { Request, Response, NextFunction } from "express";
import { body, check, ValidationChain } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

import validatorMiddleware from "../middlewares/validatorMiddleware";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export const createUserValidator: RequestHandler[] = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val: string, { req }: any) => {
      req.body.slug = slugify(val);
      return true;
    }) as ValidationChain,

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val: string) =>
      AppDataSource.getRepository(User)
        .findOne({ where: { email: val } })
        .then((user) => {
          if (user) {
            return Promise.reject(new Error("E-mail already in use"));
          }
        })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password: string, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("passwordConfirm required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware as RequestHandler,
];

export const getAllUsersValidator: RequestHandler[] = [
  check("limit").optional().isNumeric().withMessage("Limit should be a number"),
  check("page")
    .optional()
    .isNumeric()
    .withMessage("Page number should be a number"),
];

export const getSingleUserValidator: RequestHandler[] = [
  check("userId")
    .notEmpty()
    .withMessage("provide user id.")
    .isNumeric()
    .withMessage("User Id should be a numerical value"),
];

export const updateUserValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number, only accepted Egy and SA Phone numbers"
    ),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const deleteUserValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const changeUserPasswordValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter a new password")
    .custom(async (val, { req }) => {
      const userRepository = AppDataSource.getRepository(User);
      const userId = req.params.id;

      // 1) Verify current password
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware as RequestHandler,
];

export const updateLoggedUserValidator: RequestHandler[] = [
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }) as ValidationChain,
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email: val } });
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number; only Egyptian and Saudi phone numbers are accepted"
    ),
  validatorMiddleware as RequestHandler,
];
