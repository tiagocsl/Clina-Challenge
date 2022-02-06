import { User } from "./user";

export interface ServicePort {
    createUser(user: User): Promise<object>;
    getUserById(id: number): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    authenticateUserByEmail(cpf: string, password: string): Promise<object>;
    verifyUserAuthenticatedToken(token: string): Promise<void>;
}

export interface StoragePort {
    persistUser(user: User): Promise<User>;
    getUserById(id: number): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    findUserById(id: number): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    findAllUsers(): Promise<User[]>
}

export interface AuthenticatorPort {
    generateToken(data: object): Promise<string>;
    verifyToken(token: string): Promise<void>;
    getUserTokenClaim(token: string): Promise<User>;
}

export interface CryptorPort {
    encrypt(data: string): Promise<string>;
    compare(data: string, encrypted: string): Promise<boolean>;
}
