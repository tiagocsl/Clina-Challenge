export interface Room {
    id: number;
    name: string;
    description: string;
    uf: string;
    cep: string;
    city: string;
    number: string;
    country: string;
    publicPlace: string;
    complement: string | null;
    neighborhood: string;
}

export interface RoomImage {
    id: number;
    filename: string;
    filepath: string;
    mimetype: string;
    size: bigint | number;
    roomId: number;
}