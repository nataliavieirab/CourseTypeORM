import { ValidationErrorItem } from "joi";
import Address from "../entities/Address";
import { AppDataSource } from "../../database/data-source";
import ErrorExtension from "../utils/ErrorExtension";
import addressSchemaValidation from "../utils/validations/addressSchemaValidation";
import { IAddressInput, IAddressOutput } from "../interfaces/IAddress";

class AddressRepository {
  private static addressRepository = AppDataSource.getRepository(Address);

  static async getAddress(): Promise<IAddressOutput[]> {
    return await this.addressRepository.find({ relations: { users: true } });
  }

  static async newAddress(address: IAddressInput): Promise<IAddressOutput> {
    const { error } = addressSchemaValidation.validate(address, {
      abortEarly: false,
    });
    if (error) {
      const validadeErrors = error.details.map(
        (detail: ValidationErrorItem) => detail.message,
      );
      throw new ErrorExtension(400, validadeErrors.join(","));
    }

    const createdAddress = await this.addressRepository.save(address);
    return createdAddress;
  }

  static async removeAddress(id: number): Promise<string> {
    await this.addressRepository.delete(id);
    return "Address Removed!!";
  }
}

export default AddressRepository;
