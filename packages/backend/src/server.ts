import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./data-source";
import { tasksRouter } from "./tasks/tasks.router";
import { usersRouter } from "./users/users.router";

const app: Express = express();
dotenv.config({ path: "../../.env" });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use("/users", usersRouter);
app.use("/", tasksRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
