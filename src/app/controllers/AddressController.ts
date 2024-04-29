import { Request, Response, Router } from "express";
import AddressRepository from "../repositories/AddressRepository";

class AddressController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.getAllAddress);
    this.router.post("/", this.createAddress);
    this.router.delete("/:id", this.deleteAddress);
  }

  private async getAllAddress(req: Request, res: Response) {
    const address = await AddressRepository.getAddress();
    res.status(200).json(address);
  }

  private async createAddress(req: Request, res: Response) {
    const address = req.body;
    const newAddress = await AddressRepository.newAddress(address);
    res.status(201).json(newAddress);
  }

  private async deleteAddress(req: Request, res: Response) {
    const addressId = parseInt(req.params.id);
    const deletedAddress = await AddressRepository.removeAddress(addressId);
    res.status(200).json({ message: deletedAddress });
  }
}

const addressRouter = new AddressController().router;
export default addressRouter;
