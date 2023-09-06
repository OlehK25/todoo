import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Priority } from "../enums/Priority";
import { Status } from "../enums/Status";
import { User } from "../users/users.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
  })
  title: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  date: string;

  @Column({
    type: "longtext",
  })
  description: string;

  @Column({
    type: "enum",
    enum: Priority,
    default: Priority.normal,
  })
  priority: Priority;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.todo,
  })
  status: Status;

  @Column({ type: "int" })
  order: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: { id: string };
}
