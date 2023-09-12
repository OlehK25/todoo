import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("password_reset_tokens")
export class PasswordResetToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  token: number;

  @Column()
  expiresAt: Date;
}
