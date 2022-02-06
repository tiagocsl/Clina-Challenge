import { Schedule } from './schedule'

export interface ServicePort {
    createSchedule(schedule: Schedule): Promise<Schedule>;
    bookAnSchedule(schedule_id: number): Promise<Schedule>;
    getScheduleById(schedule_id: number): Promise<Schedule | undefined>;
    getSchedulesByRoomId(room_id: number): Promise<Schedule[]>;
    getScheduleByDayAndRoom(schedule: Schedule): Promise<Schedule | undefined>;
}

export interface StoragePort {
    persistSchedule(schedule: Schedule): Promise<Schedule>;
    bookAnSchedule(schedule_id: number): Promise<Schedule>;
    getSchedule(schedule: Schedule): Promise<Schedule | undefined>;
    getScheduleById(schedule_id: number): Promise<Schedule | undefined>;
    getSchedulesByRoomId(room_id: number): Promise<Schedule[]>;
    getScheduleByDayAndRoom(day: Date, room_id: number): Promise<Schedule | undefined>;
}