import { IRouter, Router } from "express";

import { ServicePort as UserServicePort } from "../../../domain/user/port";
import { ServicePort as RoomServicePort } from "../../../domain/room/port";
import { ServicePort as ScheduleServicePort } from "../../../domain/schedule/port";

import { AuthenticatorPort } from "../../../domain/user/port";

import configureUserRouter from "./user";
import configureRoomRouter from "./room";
import configureScheduleRouter from "./schedule";

export default function configRouter(
    userService: UserServicePort,
    roomService: RoomServicePort,
    scheduleService: ScheduleServicePort,
    authenticator: AuthenticatorPort
): IRouter {
    const router: IRouter = Router();

    router.use("/user", configureUserRouter(userService, authenticator));
    router.use("/room", configureRoomRouter(roomService));
    router.use("/schedule", configureScheduleRouter(scheduleService, authenticator));

    return router;
}