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