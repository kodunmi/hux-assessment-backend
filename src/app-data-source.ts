import { DataSource } from "typeorm";

const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  entities: ["src/entity/*.js"],
  logging: true,
  synchronize: true,
});
