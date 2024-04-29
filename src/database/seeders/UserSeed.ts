import { IUserInput } from "../../app/interfaces/IUser";

const userSeed: IUserInput = {
  name: "admin",
  email: "admin@admin.com",
  password: "root",
  birth_date: new Date("1999-04-14"),
  active: true,
};

export default userSeed;
