import { User, UserAvatar } from "./user";
import { AuthenticatorPort, CryptorPort, ServicePort, StoragePort } from "./port";

export default class Service implements ServicePort {
    constructor(
        private storage: StoragePort,
        private authenticator: AuthenticatorPort,
        private cryptor: CryptorPort
    ) { }

    async createUser(user: User): Promise<object> {
        const hasUserByEmail: User | undefined = await this.storage.getUserByEmail(user.email);
        if (hasUserByEmail) throw new Error("Já existe um registro de user com o mesmo email");

        const encryptedPassword: string = await this.cryptor.encrypt(user.password);
        const _user: User = await this.storage.persistUser({ ...user, password: encryptedPassword });

        const accessToken: string = await this.authenticator.generateToken({ ..._user, password: '' });

        return { token: accessToken }
    }

    async getUserByEmail(email: string): Promise<User> {
        const user: User = await this.storage.findUserByEmail(email);
        return user;
    }

    async getUserById(id: number): Promise<User> {
        const user: User = await this.storage.findUserById(id);
        return user;
    }

    async authenticateUserByEmail(email: string, password: string): Promise<object> {
        const _user: User = await this.recognizeUserToAuthenticateByEmail(email, password);

        const accessToken: string = await this.authenticator.generateToken({ ..._user, password: '' });

        return { token: accessToken };
    }

    async recognizeUserToAuthenticateByEmail(email: string, password: string): Promise<User> {
        const _user: User = await this.storage.findUserByEmail(email);
        const isValid: boolean = await this.cryptor.compare(password, _user.password);
        if (!isValid) throw new Error("Usuário não autorizado");

        return _user;
    }

    async verifyUserAuthenticatedToken(token: string): Promise<void> {
        await this.authenticator.verifyToken(token);
    }

    async getUserByToken(token: string): Promise<User> {
        const user = await this.authenticator.getUserTokenClaim(token);
        return user;
    }

    async uploadAvatars(userAvatars: object[]): Promise<void> {
        const _userAvatars = userAvatars as UserAvatar[];

        const haveUserWithThisId: User | undefined = await this.storage.getUserById(_userAvatars[0].userId);
        if (!haveUserWithThisId) throw new Error('Não existe um usuario com esse ID!');

        await this.storage.persistAvatars(userAvatars as UserAvatar[]);
        return;
    }

    async getAvatarsByUserId(user_id: number): Promise<UserAvatar[]> {
        let _avatars = await this.storage.getAvatarsByUserId(user_id);
        _avatars = _avatars.map((avatar) => {
            return {
                ...avatar,
                size: Number(avatar.size)
            }
        })
        return _avatars;
    }

    async getAvatarByFilename(avatarName: string): Promise<UserAvatar | undefined> {
        const _avatar = await this.storage.getAvatarByFilename(avatarName);
        if (!_avatar) throw new Error('Não existe uma avatarm com esse nome!');

        return _avatar;
    }

}