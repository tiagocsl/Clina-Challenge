import bcrypt from 'bcrypt';

import { CryptorPort } from "../../../domain/user/port";

export default class BCryptCryptor implements CryptorPort {
  constructor(
  ) { }

  async encrypt(data: string): Promise<string> {
    const salt: any = await bcrypt.genSalt();
    const encrypted: string = await bcrypt.hash(data, salt);
    return encrypted;
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    const isValid: boolean = await bcrypt.compare(data, encrypted);
    return isValid;
  }
}