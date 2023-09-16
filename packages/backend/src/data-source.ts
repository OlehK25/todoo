import { DataSource } from "typeorm";

import { Task } from "./tasks/tasks.entity";
import { User } from "./users/users.entity";
import { PasswordResetToken } from "./auth/password.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  port: 3306,
  host: process.env.CLEARDB_HOST || process.env.MYSQL_HOST,
  username: process.env.CLEARDB_USER || process.env.MYSQL_USER,
  password: process.env.CLEARDB_PASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.CLEARDB_DB || process.env.MYSQL_DB,
  entities: [Task, User, PasswordResetToken],
  logging: true,
  synchronize: true,
});
