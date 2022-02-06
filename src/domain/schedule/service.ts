import { Schedule } from "./schedule";
import { ServicePort, StoragePort } from "./port";

import { ServicePort as RoomService } from "../room/port";
import { Room } from "../room/room";
import moment from "moment";

export default class Service implements ServicePort {
    constructor(
        private storage: StoragePort,
        private roomService: RoomService
    ) { }

    async createSchedule(schedule: Schedule): Promise<Schedule> {
        const _room: Room | undefined = await this.roomService.getRoomById(schedule.roomId);
        if (!_room) throw new Error('Sala não encontrada!');

        const dayNormalized: Date = moment(schedule.day, "DD/MM/YYYY").toDate();

        const hasScheduleWithSameData: Schedule | undefined = await this.storage.getSchedule({ ...schedule, day: dayNormalized });
        if (hasScheduleWithSameData) throw new Error(`Já existe uma Agenda para o dia ${schedule.day}, no mesmo período, nessa mesma sala!`);

        const _schedule = await this.storage.persistSchedule({ ...schedule, day: dayNormalized });

        return _schedule;
    }

    async bookAnSchedule(schedule_id: number): Promise<Schedule> {
        const haveScheduleWithThisId: Schedule | undefined = await this.storage.getScheduleById(schedule_id);
        if (!haveScheduleWithThisId) throw new Error('Não existe uma agenda com esse ID!');

        const _schedule: Schedule = await this.storage.bookAnSchedule(schedule_id);

        return _schedule;
    }

    async getScheduleById(schedule_id: number): Promise<Schedule | undefined> {
        const _schedule: Schedule | undefined = await this.storage.getScheduleById(schedule_id);

        return _schedule;
    }

    async getScheduleByDayAndRoom(schedule: Schedule): Promise<Schedule | undefined> {
        const _schedule: Schedule | undefined = await this.storage.getScheduleByDayAndRoom(schedule.day, schedule.roomId);

        return _schedule;
    }

    async getSchedulesByRoomId(room_id: number): Promise<Schedule[]> {
        const _schedules: Schedule[] = await this.storage.getSchedulesByRoomId(room_id);

        return _schedules;
    }
}