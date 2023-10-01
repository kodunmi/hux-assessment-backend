import { UserRoles } from "@src/models/User";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.Standard,
  })
  role: UserRoles;

  @Column()
  password: string;
}
