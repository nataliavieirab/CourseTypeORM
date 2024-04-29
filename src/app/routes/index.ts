import { Router } from "express";
import userRouter from "../controllers/UserController";
import addressRouter from "../controllers/AddressController";

const routers = Router();

routers.use("/users", userRouter);
routers.use("/address", addressRouter);

export default routers;
