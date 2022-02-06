import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import { Schedule } from '../../../domain/schedule/schedule';
import { ServicePort } from "../../../domain/schedule/port";

const createScheduleValidationSchema: Schema = {
  day: {
    isDate: {
      errorMessage: 'Formato de data inválido!',
      options: { format: 'dd/MM/yyyy' }
    }
  },
  period: {
    isString: {
      errorMessage: 'Formato inválido!'
    },
    custom: {
      options: (value) => {
        if (value === 'Manhã' || value === 'Tarde' || value === 'Noite') {
          return true;
        } else {
          throw new Error('Período desconhecido ou inválido!')
        }
      }
    }
  },
  status: {
    isString: {
      errorMessage: 'Formato inválido!'
    },
    custom: {
      options: (value) => {
        if (value === "Disponivel" || value === "Indisponivel" || value === "Reservada") {
          return true;
        } else {
          throw new Error('Status desconhecido ou inválido!');
        }
      }
    }
  },
  roomId: {
    isInt: {
      errorMessage: 'Formato Inválido!'
    }
  }
}

export const createSchedule = (service: ServicePort) => async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array().map(({ param, msg }) => ({ field: param, message: msg })) })
  }
  try {
    const _schedule = await service.createSchedule(req.body as Schedule);
    res.status(HttpStatusCodes.CREATED).json(_schedule);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const bookAnSchedule = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const scheduleId = parseInt(req.params.scheduleId);
    const _schedule = await service.bookAnSchedule(scheduleId);
    res.status(HttpStatusCodes.OK).json(_schedule);
  } catch (err) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: (err as Error).message });
  }
}

export const getSchedulesByRoomId = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.roomId);
    const _schedules = await service.getSchedulesByRoomId(roomId);
    res.status(HttpStatusCodes.OK).json(_schedules);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export default function configureLoginRouter(service: ServicePort): IRouter {
  const router: IRouter = Router();

  router.post("/", checkSchema(createScheduleValidationSchema), createSchedule(service));
  router.put("/:scheduleId", bookAnSchedule(service));
  router.get("/:roomId", getSchedulesByRoomId(service));

  return router;
}