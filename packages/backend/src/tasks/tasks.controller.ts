import { Request, Response } from "express";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validationResult } from "express-validator";
import { UpdateResult } from "typeorm";

import { Task } from "./tasks.entity";
import { AppDataSource } from "../data-source";
import { User } from "../users/users.entity";

class TasksController {
  public async getAllTasks(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.user?.id) {
        return res.status(403).json({ error: "User not authenticated" });
      }

      const tasks = await AppDataSource.getRepository(Task).find({
        where: { user: { id: req.body.user?.id } },
        order: {
          order: "DESC",
        },
      });

      return res.status(200).json(tasks);
    } catch (_err) {
      console.error(_err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async createTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let allTasks: Task[] = [];
    allTasks = await AppDataSource.getRepository(Task).find({
      order: {
        order: "DESC",
      },
    });
    allTasks = instanceToPlain(allTasks) as Task[];

    const newTask = new Task();

    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;
    newTask.order = allTasks.length + 1;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: req.body.user?.id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    newTask.user = user;

    // save the task to the database
    let createdTask: Task;
    try {
      createdTask = await AppDataSource.getRepository(Task).save(newTask);
      createdTask = instanceToPlain(createdTask) as Task;
      createdTask.user = { id: createdTask.user.id };
      return res.status(201).json(createdTask);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!task) {
      return res
        .status(404)
        .json({ error: "The task with given ID doesn't exist" });
    }

    let updatedTask: UpdateResult;

    try {
      updatedTask = await AppDataSource.getRepository(Task).update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
          order: req.body.order,
        }),
      );

      updatedTask = instanceToPlain(updatedTask) as UpdateResult;
      return res.status(200).json(updatedTask);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const taskId: string = req.params.id;

      const task = await AppDataSource.getRepository(Task).find({
        where: { id: taskId },
      });

      if (!task) {
        return res
          .status(404)
          .json({ error: "The task with the given ID doesn't exist" });
      }

      await AppDataSource.getRepository(Task).delete(taskId);

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async updateTaskOrder(req: Request, res: Response): Promise<Response> {
    const { id, order } = req.body;

    try {
      await AppDataSource.getRepository(Task).update(id, { order });
      return res.status(200).send({ message: "Order updated successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const taskController = new TasksController();
