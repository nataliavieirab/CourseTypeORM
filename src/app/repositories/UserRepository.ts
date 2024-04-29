/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateResult } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import User from "../entities/User";
import { IUserInput, IUserOutput } from "../interfaces/IUser";
import ErrorExtension from "../utils/ErrorExtension";
import userSchemaValidation from "../utils/validations/userSchemaValidation";
import { ValidationErrorItem } from "joi";
import bcrypt from "bcrypt";
import { ILogin } from "../interfaces/ILogin";
import Auth from "../utils/Auth";

class UserRepository {
  private static usersRepository = AppDataSource.getRepository(User);

  static async getUsers(): Promise<IUserOutput[]> {
    const users = await this.usersRepository.find({
      relations: { address: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  static async newUser(user: IUserInput): Promise<IUserOutput> {
    const { error } = userSchemaValidation.validate(user, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = error.details.map(
        (detail: ValidationErrorItem) => detail.message,
      );

      throw new ErrorExtension(400, validationErrors.join(","));
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.usersRepository.save(user);

    const { password, ...userReturned } = createdUser;

    return userReturned;
  }

  static async getUser(id: number): Promise<IUserOutput | null> {
    // findBy() => SELECT * FROM USERS WHERE id = id
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new ErrorExtension(404, "User not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userReturned } = user;

    return userReturned;
  }

  static async updateUser(
    id: number,
    user: IUserOutput,
  ): Promise<IUserOutput | null> {
    const userExists = await this.usersRepository.findOneBy({ id });

    if (!userExists) {
      throw new ErrorExtension(404, "User not found");
    }

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    const updatedResult: UpdateResult = await this.usersRepository.update(
      id,
      user,
    );

    if (updatedResult.affected === 0) {
      throw new ErrorExtension(404, "No rows were updated or user not found");
    }

    const updatedUser = await this.usersRepository.findOneBy({
      id,
    });

    if (!updatedUser) {
      throw new ErrorExtension(404, "User not found");
    }

    return updatedUser;
  }

  static async deleteUser(id: number): Promise<void> {
    const userExists = await this.usersRepository.findOneBy({ id });

    if (!userExists) {
      throw new ErrorExtension(404, "User not found");
    }

    await this.usersRepository.delete({ id });
  }

  static async getUserByEmail(email: string): Promise<IUserOutput | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  static async auth(loginData: ILogin): Promise<string> {
    const { email, password } = loginData;

    if (!email || !password) throw new ErrorExtension(401, "Missing Data");

    const user = await this.getUserByEmail(email);

    if (!user?.password) {
      throw new ErrorExtension(401, "Email or Password wrong");
    } else {
      const passwordVerification = await bcrypt.compare(
        password,
        user.password,
      );
      console.log(passwordVerification);
      if (!passwordVerification) {
        throw new ErrorExtension(401, "Email or Password wrong");
      }
    }

    const payload = {
      name: user.name,
      email: user.email,
    };

    const auth = new Auth();
    const token = auth.JwtGenerator(payload);
    return token;
  }
}

export default UserRepository;
