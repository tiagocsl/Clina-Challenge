import jwt, { JwtPayload } from 'jsonwebtoken';

import { User } from '../../../domain/user/user';
import { AuthenticatorPort } from "../../../domain/user/port";

export default class JWTAuthenticator implements AuthenticatorPort {
  constructor(
    private readonly secret: string
  ) { }

  async generateToken(data: User): Promise<string> {
    const token: string = jwt.sign(data as Object, this.secret, { expiresIn: '8h' });
    return token;
  }

  async verifyToken(token: string): Promise<void> {
    jwt.verify(token, this.secret);
  }

  async getUserTokenClaim(token: string): Promise<User> {
    const decoded: JwtPayload = jwt.verify(token, this.secret) as JwtPayload;
    return (decoded as User);
  }

  async getUserId(token: string): Promise<number> {
    const decoded: JwtPayload = jwt.verify(token, this.secret) as JwtPayload;
    const user: User = (decoded as User);
    return user.id;
  }
}