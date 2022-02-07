export interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
}

export interface UserAvatar {
    id: number;
    filename: string;
    filepath: string;
    mimetype: string;
    size: bigint | number;
    userId: number;
}

