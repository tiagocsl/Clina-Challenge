import { Room, RoomImage } from './room'

export interface ServicePort {
    createRoom(room: Room): Promise<Room>;
    uploadImages(roomImages: object[]): Promise<void>;
    getImagesByRoomId(room_id: number): Promise<RoomImage[]>;
    getImageByFilename(imageName: string): Promise<RoomImage | undefined>
    getRoomById(room_id: number): Promise<Room | undefined>;
    listRooms(): Promise<Room[] | undefined>;
    listRoomsPerStatus(status: string): Promise<Room[] | undefined>;
    listAvailableRoomsPerDay(day: string): Promise<Room[] | undefined>;
    listHandler(serializer: string | undefined, status: string | undefined, date: string | undefined): Promise<Room[] | undefined>;
}

export interface StoragePort {
    persistRoom(room: Room): Promise<Room>;
    persistImages(roomImage: RoomImage[]): Promise<void>;
    getImageByFilename(imageName: string): Promise<RoomImage | undefined>
    getImagesByRoomId(room_id: number): Promise<RoomImage[]>;
    getRoomById(room_id: number): Promise<Room | undefined>;
    getRoom(room: Room): Promise<Room | undefined>;
    listRooms(): Promise<Room[] | undefined>;
    listRoomsPerStatus(status: string): Promise<Room[] | undefined>;
    listAvailableRoomsPerDay(day: Date): Promise<Room[] | undefined>;
}