    import { Request, Response, NextFunction } from "express";
    import { body, check, ValidationChain } from "express-validator";
    import slugify from "slugify";
    import { getRepository } from "typeorm";
    import { User } from "../entity/User.entity";
    import { AppDataSource } from "../data-source";

    import validatorMiddleware from "../middlewares/validatorMiddleware";

    export const signupValidator = [
    check("name")
        .notEmpty()
        .withMessage("User required")
        .isLength({ min: 3 })
        .withMessage("Too short User name")
        .custom((val: any, { req }: any) => {
        req.body.slug = slugify(val);
        return true;
        }),

    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (val) => {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email: val } });
        if (user) {
            return Promise.reject(new Error("E-mail already in use"));
        }
        }),

    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((password: any, { req }: any) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error("passwordConfirmation incorrect");
        }
        return true;
        }),

    check("passwordConfirm").notEmpty().withMessage("passwordConfirm required"),

    validatorMiddleware,
    ];

    export const loginValidator = [
    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address"),

    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validatorMiddleware,
    ];
