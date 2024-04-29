import { Request, Response, Router } from "express";
import UserRepository from "../repositories/UserRepository";
import AuthenticateMiddleware from "../middlewares/AuthMiddleware";

class UserController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getAllUsers);
    this.router.post("/", this.createUser);
    this.router.get("/:id", AuthenticateMiddleware, this.getUser);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.deleteUser);
    this.router.post("/auth", this.authenticationUser);
  }

  private async getAllUsers(req: Request, res: Response) {
    const users = await UserRepository.getUsers();
    res.status(200).json(users);
  }

  private async createUser(req: Request, res: Response) {
    const user = req.body;
    const newUser = await UserRepository.newUser(user);
    res.status(201).json(newUser);
  }

  private async getUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const user = await UserRepository.getUser(userId);
    res.status(200).json(user);
  }

  private async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const user = req.body;
    const updateUser = await UserRepository.updateUser(userId, user);
    res.status(200).json(updateUser);
  }

  private async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const deletedUser = await UserRepository.deleteUser(userId);
    res.status(200).json({ message: deletedUser });
  }

  private async authenticationUser(req: Request, res: Response) {
    const user = req.body;
    const token = await UserRepository.auth(user);
    res.status(200).json(token);
  }
}

const userRouter = new UserController().router;
export default userRouter;
