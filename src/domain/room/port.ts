import { Room } from './room'

export interface ServicePort {
    createRoom(room: Room): Promise<Room>;
    getRoomById(room_id: number): Promise<Room | undefined>;
    listRooms(): Promise<Room[] | undefined>;
    listRoomsPerStatus(status: string): Promise<Room[] | undefined>;
    listAvailableRoomsPerDay(day: string): Promise<Room[] | undefined>;
    listHandler(serializer: string | undefined, status: string | undefined, date: string | undefined): Promise<Room[] | undefined>;
}

export interface StoragePort {
    persistRoom(room: Room): Promise<Room>;
    getRoomById(room_id: number): Promise<Room | undefined>;
    getRoom(room: Room): Promise<Room | undefined>;
    listRooms(): Promise<Room[] | undefined>;
    listRoomsPerStatus(status: string): Promise<Room[] | undefined>;
    listAvailableRoomsPerDay(day: Date): Promise<Room[] | undefined>;
}