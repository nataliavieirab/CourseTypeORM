import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1713815084032 } from "./migrations/1713815084032-CreateUsersTable";
import User from "../app/entities/User";
import { CreateSeedUsersTable1713821200033 } from "./migrations/1713821200033-CreateSeedUsersTable";
import { CreateAdressTable1714418544884 } from "./migrations/1714418544884-CreateAdressTable";
import { ModifyStateColumnLength1714420949972 } from "./migrations/1714420949972-ModifyStateColumnLength";
import Address from "../app/entities/Address";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "root",
  database: "curso_typeorm",
  synchronize: true,
  logging: false,
  entities: [User, Address],
  migrations: [
    CreateUsersTable1713815084032,
    CreateSeedUsersTable1713821200033,
    CreateAdressTable1714418544884,
    ModifyStateColumnLength1714420949972,
  ],
  subscribers: [],
});
