import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import { Room } from '../../../domain/room/room';
import { ServicePort } from "../../../domain/room/port";

const createRoomValidationSchema: Schema = {
  name: {
    isString: {
      errorMessage: 'Formato de data inválido!',
    }
  },
  description: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  },
  cep: {
    isPostalCode: {
      errorMessage: 'Formato de CEP Inválido!',
      options: "BR"
    }
  },
  country: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  },
  uf: {
    isString: {
      errorMessage: 'Formato inválido!'
    },
    isLength: {
      errorMessage: 'Quantidade de caracteres deve ser 2!',
      options: { min: 2, max: 2 }
    }
  },
  city: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  },
  neighborhood: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  },
  publicPlace: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  },
  number: {
    isString: {
      errorMessage: 'Formato inválido!'
    }
  }
}

export const createRoom = (service: ServicePort) => async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array().map(({ param, msg }) => ({ field: param, message: msg })) })
  }
  try {
    const _room = await service.createRoom(req.body as Room);
    res.status(HttpStatusCodes.CREATED).json(_room);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const listRooms = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    let date = req.query.date;
    let status = req.query.status;
    let serializer = req.query.serializer;
    const _rooms = await service.listHandler(
      serializer as string | undefined,
      status as string | undefined,
      date as string | undefined
    );
    res.status(HttpStatusCodes.OK).json(_rooms);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const getRoomById = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    const _room = await service.getRoomById(roomId);
    res.status(HttpStatusCodes.OK).json(_room);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export default function configureLoginRouter(service: ServicePort): IRouter {
  const router: IRouter = Router();

  router.post("/create", checkSchema(createRoomValidationSchema), createRoom(service));
  router.get("/list", listRooms(service));
  router.get("/:id", getRoomById(service));

  return router;
}