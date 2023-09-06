import { Router } from "express";
import { taskController } from "./tasks.controller";
import { createValidator, updateValidator } from "./tasks.validator";
import { authMiddleware } from "../middleware/auth";

export const tasksRouter: Router = Router();

tasksRouter.use(authMiddleware);

tasksRouter.get("/tasks", taskController.getAllTasks);
tasksRouter.post("/tasks", createValidator, taskController.createTask);
tasksRouter.put("/tasks", updateValidator, taskController.updateTask);
tasksRouter.delete("/tasks/:id", taskController.deleteTask);
tasksRouter.put("/tasks/order", taskController.updateTaskOrder);
