import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenData } from "../interfaces/ILogin";
import ErrorExtension from "./ErrorExtension";

dotenv.config();

const secret = process.env.JWT_SECRET as string;

const jwtDefaultConfig: SignOptions = {
  algorithm: "HS256",
  expiresIn: "1h",
};

class Auth {
  constructor(private jwtConfig?: SignOptions) {
    if (!jwtConfig) {
      this.jwtConfig = jwtDefaultConfig;
    }
  }

  public JwtGenerator(payload: ITokenData) {
    return jwt.sign(payload, secret, this.jwtConfig);
  }

  public AuthenticateToken(token: string) {
    if (!token) {
      throw new ErrorExtension(401, "Token Not Found");
    }

    try {
      const validateJwt = jwt.verify(token, secret, this.jwtConfig);

      return validateJwt;
    } catch (error) {
      throw new ErrorExtension(401, "Token Invalid");
    }
  }
}

export default Auth;
