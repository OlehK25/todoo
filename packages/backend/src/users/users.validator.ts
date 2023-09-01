import { body, ValidationChain } from "express-validator";

export const signupValidation: ValidationChain[] = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true })
    .withMessage("Please include a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),
  body("passwordConfirm")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),
];

export const loginValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true })
    .withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 or more characters"),
];
