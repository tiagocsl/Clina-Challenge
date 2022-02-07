import { User, UserAvatar } from "./user";

export interface ServicePort {
    createUser(user: User): Promise<object>;
    uploadAvatars(userAvatars: object[]): Promise<void>;
    getAvatarsByUserId(user_id: number): Promise<UserAvatar[]>;
    getAvatarByFilename(avatarName: string): Promise<UserAvatar | undefined>
    getUserById(id: number): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    authenticateUserByEmail(cpf: string, password: string): Promise<object>;
    verifyUserAuthenticatedToken(token: string): Promise<void>;
}

export interface StoragePort {
    persistUser(user: User): Promise<User>;
    persistAvatars(userAvatar: UserAvatar[]): Promise<void>;
    getAvatarByFilename(avatarName: string): Promise<UserAvatar | undefined>
    getAvatarsByUserId(user_id: number): Promise<UserAvatar[]>;
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
