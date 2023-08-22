import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import { AppDataSource } from "./data-source";
import { tasksRouter } from "./tasks/tasks.router";

const app: Express = express();
dotenv.config({ path: "../../.env" });

app.use(bodyParser.json());
app.use(cors());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

app.use("/", tasksRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});
