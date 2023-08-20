import { Request, Response } from "express";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validationResult } from "express-validator";

import { Task } from "./tasks.entity";
import { AppDataSource } from "../data-source";
import { UpdateResult } from "typeorm";

class TasksController {
  public async getAllTasks(req: Request, res: Response): Promise<Response> {
    let allTasks: Task[] = [];

    try {
      allTasks = await AppDataSource.getRepository(Task).find({
        order: {
          date: "ASC",
        },
      });

      allTasks = instanceToPlain(allTasks) as Task[];
      return res.json(allTasks).status(200);
    } catch (_err) {
      console.error(_err);
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }

  public async createTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTask = new Task();

    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // save the task to the database
    let createdTask: Task;
    try {
      createdTask = await AppDataSource.getRepository(Task).save(newTask);
      createdTask = instanceToPlain(createdTask) as Task;
      return res.json(createdTask).status(201);
    } catch (error) {
      console.error(error);
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }

  public async updateTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Try to find if the task exists
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(Task).findOne({
        where: { id: req.body.id },
      });
    } catch (error) {
      console.error(error);
      return res.json({ error: "Internal Server Error" }).status(500);
    }

    if (!task) {
      return res
        .json({ error: "The task with given ID doesn't exist" })
        .status(404);
    }

    let updatedTask: UpdateResult;

    try {
      updatedTask = await AppDataSource.getRepository(Task).update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
        }),
      );

      updatedTask = instanceToPlain(updatedTask) as UpdateResult;
      return res.json(updatedTask).status(200);
    } catch (err) {
      console.error(err);
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }
}

export const taskController = new TasksController();
