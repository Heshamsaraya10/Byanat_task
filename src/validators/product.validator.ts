import { Request, Response, NextFunction } from "express";
import { body, check, ValidationChain } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { Product } from "./../entity/Product.entity";
import { AppDataSource } from "../data-source";

import validatorMiddleware from "../middlewares/validatorMiddleware";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export const createProductValidator: RequestHandler[] = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }) as ValidationChain,

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description") as ValidationChain,
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number") as ValidationChain,
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number") as ValidationChain,
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price") as ValidationChain,
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }) as ValidationChain,
  check("imageCover")
    .notEmpty()
    .withMessage("Product imageCover is required") as ValidationChain,
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string") as ValidationChain,

  validatorMiddleware as RequestHandler,
];

export const getSingleProductValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid ID formate") as ValidationChain,
  validatorMiddleware as RequestHandler,
];

export const updateProductValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid ID formate") as ValidationChain,
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }) as ValidationChain,
  validatorMiddleware as RequestHandler,
];

export const deleteProductValidator: RequestHandler[] = [
  check("id").isInt().withMessage("Invalid id format") as ValidationChain,

  validatorMiddleware as RequestHandler,
];
