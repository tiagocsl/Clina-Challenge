import moment from 'moment';

import prisma from '../../../../prisma/prismaClient'

import { User, UserAvatar } from '../../../domain/user/user';
import { Room, RoomImage } from '../../../domain/room/room';
import { Schedule } from '../../../domain/schedule/schedule';

import { StoragePort as UserStoragePort } from '../../../domain/user/port';
import { StoragePort as RoomStoragePort } from '../../../domain/room/port';
import { StoragePort as ScheduleStoragePort } from '../../../domain/schedule/port';


export default class PostgresStorage implements UserStoragePort, RoomStoragePort, ScheduleStoragePort {
  user = prisma.user;
  userAvatars = prisma.userAvatar;
  room = prisma.room;
  roomImages = prisma.roomImages;
  schedule = prisma.schedule;


  /*
   * User Storage Actions
   */

  async persistUser(user: User): Promise<User> {
    const _user = await this.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        createdAt: moment(Date.now()).toDate(),
      }
    })

    return _user
  }

  async findUserById(id: number): Promise<User> {
    const _user = await this.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!_user) throw new Error("User não encontrado");

    return { ..._user, id: _user.id } as User;
  }

  async findUserByEmail(email: string): Promise<User> {
    const _user = await this.user.findUnique({
      where: {
        email: email,
      },
    })
    if (!_user) throw new Error("User não encontrado");

    return { ..._user, email: _user.email } as User;
  }

  async findAllUsers(): Promise<User[]> {
    const _users: User[] = await this.user.findMany()

    return _users;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const _user = await this.user.findUnique({
      where: {
        email: email,
      },
    })
    if (!_user) return;

    return { ..._user, id: _user.id }
  }

  async getUserById(id: number): Promise<User | undefined> {
    const _user = await this.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!_user) return;

    return { ..._user, id: _user.id }
  }

  async persistAvatars(userAvatar: UserAvatar[]): Promise<void> {
    await this.userAvatars.createMany({
      data: userAvatar
    })

    return;
  }

  async getAvatarsByUserId(user_id: number): Promise<UserAvatar[]> {
    const _userAvatars = await this.userAvatars.findMany({
      where: {
        userId: user_id
      }
    });

    return _userAvatars;
  }

  async getAvatarByFilename(imageName: string): Promise<UserAvatar | undefined> {
    const _userAvatar = await this.userAvatars.findFirst({
      where: {
        filename: imageName
      }
    });
    if (!_userAvatar) return;

    return _userAvatar;
  }

  /** 
   *
   * 
   * Room Storage Actions
   * 
   * 
   **/

  async persistRoom(room: Room): Promise<Room> {
    const _room = await this.room.create({
      data: {
        name: room.name,
        description: room.description,
        cep: room.cep,
        uf: room.uf,
        city: room.city,
        number: room.number,
        country: room.country,
        publicPlace: room.publicPlace,
        complement: room.complement,
        neighborhood: room.neighborhood,
        createdAt: moment(Date.now()).toDate()
      }
    })

    return _room
  }

  async persistImages(roomImage: RoomImage[]): Promise<void> {
    await this.roomImages.createMany({
      data: roomImage
    })

    return;
  }

  async getImagesByRoomId(room_id: number): Promise<RoomImage[]> {
    const _roomImages = await this.roomImages.findMany({
      where: {
        roomId: room_id
      }
    });

    return _roomImages;
  }

  async getImageByFilename(imageName: string): Promise<RoomImage | undefined> {
    const _roomImage = await this.roomImages.findFirst({
      where: {
        filename: imageName
      }
    });
    if (!_roomImage) return;

    return _roomImage;
  }

  async getRoomById(room_id: number): Promise<Room | undefined> {
    const _room = await this.room.findUnique({
      where: {
        id: room_id,
      },
    })
    if (!_room) return;

    return _room
  }

  async getRoom(room: Room): Promise<Room | undefined> {
    const _room = await this.room.findFirst({
      where: {
        name: room.name,
        cep: room.cep,
        uf: room.uf,
        city: room.city,
        number: room.number,
        country: room.country,
        publicPlace: room.publicPlace,
        neighborhood: room.neighborhood,
      },
    })
    if (!_room) return;

    return _room
  }

  async listRooms(): Promise<Room[] | undefined> {
    const _rooms = await this.room.findMany({
      include: { schedules: true }
    });
    return _rooms
  }

  async listRoomsPerStatus(_status: string): Promise<Room[] | undefined> {
    const _rooms = await this.room.findMany({
      where: {
        schedules: {
          some: {
            status: { equals: _status }
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        cep: true,
        uf: true,
        city: true,
        number: true,
        country: true,
        publicPlace: true,
        complement: true,
        neighborhood: true,
        schedules: {
          where: {
            status: _status
          }
        }
      }
    });
    return _rooms
  }

  async listAvailableRoomsPerDay(day: Date): Promise<Room[] | undefined> {
    const _rooms = await this.room.findMany({
      where: {
        schedules: {
          some: {
            day: {
              equals: day
            },
            status: { equals: "Disponivel" }
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        cep: true,
        uf: true,
        city: true,
        number: true,
        country: true,
        publicPlace: true,
        complement: true,
        neighborhood: true,
        schedules: {
          where: {
            day: day,
            status: "Disponivel"
          }
        }
      }
    });
    return _rooms
  }

  /**
  *
  * 
  * Schedule Storage Actions
  * 
  * 
  **/


  async persistSchedule(schedule: Schedule): Promise<Schedule> {
    const _schedule = await this.schedule.create({
      data: {
        day: schedule.day,
        period: schedule.period,
        status: schedule.status,
        roomId: schedule.roomId,
        createdAt: moment(Date.now()).toDate()
      }
    })

    return _schedule
  }

  async bookAnSchedule(schedule_id: number): Promise<Schedule> {
    const _schedule = await this.schedule.update({
      where: {
        id: schedule_id,
      },
      data: {
        status: "Reservada"
      }
    })

    return _schedule
  }

  async getSchedule(schedule: Schedule): Promise<Schedule | undefined> {
    const _schedule = await this.schedule.findFirst({
      where: {
        day: schedule.day,
        period: schedule.period,
        status: schedule.status,
        roomId: schedule.roomId,
      },
    })
    if (!_schedule) return;

    return _schedule
  }

  async getScheduleById(schedule_id: number): Promise<Schedule | undefined> {
    const _schedule = await this.schedule.findUnique({
      where: {
        id: schedule_id,
      },
    })
    if (!_schedule) return;

    return _schedule
  }

  async getScheduleByDayAndRoom(day: Date, room_id: number): Promise<Schedule | undefined> {
    const _schedule = await this.schedule.findFirst({
      where: {
        day: day,
        roomId: room_id
      },
    })
    if (!_schedule) return;

    return _schedule
  }

  async getSchedulesByRoomId(room_id: number): Promise<Schedule[]> {
    const _schedules = await this.schedule.findMany({
      where: {
        roomId: room_id,
        status: "Disponivel"
      }
    })

    return _schedules
  }

}