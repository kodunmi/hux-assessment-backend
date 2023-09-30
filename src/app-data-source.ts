import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 55000,
  username: "postgres",
  password: "postgrespw",
  database: "test3",
  entities: ["src/entity/*.{js,ts}"],
  logging: true,
  synchronize: true,
});
