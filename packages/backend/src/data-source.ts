import { DataSource } from "typeorm";
import { Task } from "./tasks/tasks.entity";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  logging: true,
  synchronize: true,
});
