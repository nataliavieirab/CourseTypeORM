import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import routers from "./app/routes";
import httpErrorMiddleware from "./app/middlewares/ErrorMiddleware";

const app = express();

app.use(cors());

app.use(express.json()); //Dados transitados em formato JSON

app.use(routers);

app.use(httpErrorMiddleware);

AppDataSource.initialize().then(() => {
  console.log("Database started!");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
  });
});
