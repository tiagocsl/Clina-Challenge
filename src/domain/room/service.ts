import { Room, RoomImage } from "./room";
import { ServicePort, StoragePort } from "./port";
import moment from "moment";

export default class Service implements ServicePort {
    constructor(
        private storage: StoragePort
    ) { }

    async createRoom(room: Room): Promise<Room> {
        let _room: Room | undefined = await this.storage.getRoom(room);
        if (_room) throw new Error(`Já existe uma sala com as mesmas informações!`);

        _room = await this.storage.persistRoom(room);

        return _room;
    }


    async getRoomById(room_id: number): Promise<Room | undefined> {
        const _room = await this.storage.getRoomById(room_id);

        return _room;
    }

    async uploadImages(roomImages: object[]): Promise<void> {
        const _roomImages = roomImages as RoomImage[];

        const haveRoomWithThisId: Room | undefined = await this.storage.getRoomById(_roomImages[0].roomId);
        if (!haveRoomWithThisId) throw new Error('Não existe uma sala com esse ID!');

        await this.storage.persistImages(roomImages as RoomImage[]);
        return;
    }

    async getImagesByRoomId(room_id: number): Promise<RoomImage[]> {
        let _images = await this.storage.getImagesByRoomId(room_id);
        _images = _images.map((image) => {
            return {
                ...image,
                size: Number(image.size)
            }
        })
        return _images;
    }

    async getImageByFilename(imageName: string): Promise<RoomImage | undefined> {
        const _image = await this.storage.getImageByFilename(imageName);
        if (!_image) throw new Error('Não existe uma imagem com esse nome!');

        return _image;
    }

    async listRooms(): Promise<Room[] | undefined> {
        const _rooms = await this.storage.listRooms();
        return _rooms;
    }

    async listRoomsPerStatus(status: string): Promise<Room[] | undefined> {
        const _rooms = await this.storage.listRoomsPerStatus(status);
        return _rooms;
    }

    async listAvailableRoomsPerDay(day: string): Promise<Room[] | undefined> {
        const dayNormalized: Date = moment(day, "YYYY-MM-DD").toDate();

        const _rooms = await this.storage.listAvailableRoomsPerDay(dayNormalized);
        return _rooms;
    }

    async listHandler(serializer: string | undefined, status: string | undefined, date: string | undefined): Promise<Room[] | undefined> {
        let _rooms;
        if (serializer == undefined
            || serializer == ''
            || status == undefined
            || status == ''
            || date == undefined
            || date == '') _rooms = await this.listRooms();
        if (serializer == "perDate")
            _rooms = await this.listAvailableRoomsPerDay(status as string);
        if (serializer == "perStatus")
            _rooms = await this.listRoomsPerStatus(date as string);

        return _rooms;
    }
}