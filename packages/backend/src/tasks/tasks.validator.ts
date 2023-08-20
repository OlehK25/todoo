import { body, ValidationChain } from "express-validator";
import { Priority } from "../enums/Priority";
import { Status } from "../enums/Status";

export const createValidator: ValidationChain[] = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("The task title is required")
    .trim()
    .isString()
    .withMessage("The task title must be a string"),
  body("date")
    .not()
    .isEmpty()
    .withMessage("The task date is required")
    .trim()
    .isString()
    .withMessage("The task date must be a string"),
  body("description")
    .trim()
    .isString()
    .withMessage("The task description must be a string"),
  body("priority")
    .trim()
    .isIn([Priority.low, Priority.normal, Priority.high])
    .withMessage("The task priority must be low, normal or high"),
  body("status")
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage("The task status must be todo, in progress or completed"),
];

export const updateValidator: ValidationChain[] = [
  body("id")
    .not()
    .isEmpty()
    .withMessage("The task ID is required")
    .trim()
    .isString()
    .withMessage("The task ID must be a valid uuid format"),
  body("status")
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage("The task status must be todo, in progress or completed"),
];
