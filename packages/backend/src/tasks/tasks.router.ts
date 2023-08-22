import { Router } from "express";
import { taskController } from "./tasks.controller";
import { createValidator, updateValidator } from "./tasks.validator";

export const tasksRouter: Router = Router();

tasksRouter.get("/tasks", taskController.getAllTasks);
tasksRouter.post("/tasks", createValidator, taskController.createTask);
tasksRouter.put("/tasks", updateValidator, taskController.updateTask);
tasksRouter.delete("/tasks/:id", taskController.deleteTask);
