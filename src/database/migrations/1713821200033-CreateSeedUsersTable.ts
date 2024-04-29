import { MigrationInterface } from "typeorm";
import { AppDataSource } from "../data-source";
import userSeed from "../seeders/UserSeed";
import User from "../../app/entities/User";

export class CreateSeedUsersTable1713821200033 implements MigrationInterface {
  public async up(): Promise<void> {
    const usersRepository = AppDataSource.getRepository(User);
    await usersRepository.save(userSeed);
  }

  public async down(): Promise<void> {}
}
