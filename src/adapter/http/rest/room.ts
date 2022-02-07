import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import multer from 'multer'

import { Room, RoomImage } from '../../../domain/room/room';
import { ServicePort } from "../../../domain/room/port";
import path from "path";

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

export const uploadImages = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const _files = req.files as Express.Multer.File[];
    const _roomImages = _files.map((file) => {
      return {
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        roomId: parseInt(roomId)
      }
    })
    await service.uploadImages(_roomImages);
    console.log(req.files)
    res.status(HttpStatusCodes.CREATED).json(_roomImages);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const getImageByFilename = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    const _roomImage = await service.getImageByFilename(filename) as RoomImage;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, _roomImage.filepath);
    res.status(HttpStatusCodes.OK).type(_roomImage.mimetype).sendFile(fullfilepath);
  } catch (err) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: (err as Error).message });
  }
}

export const getImagesByRoomId = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params
    const _roomImages = await service.getImagesByRoomId(parseInt(roomId));
    res.status(HttpStatusCodes.OK).json(_roomImages);
  } catch (err) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: (err as Error).message });
  }
}

export const listRooms = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { date, status, serializer } = req.query;
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
  const imageUpload = multer({
    storage: multer.diskStorage(
      {
        destination: function (req, file, cb) {
          cb(null, 'images/');
        },
        filename: function (req, file, cb) {
          cb(
            null,
            new Date().valueOf() +
            '_' +
            file.originalname
          );
        }
      }
    ),
  });

  router.post("/create", checkSchema(createRoomValidationSchema), createRoom(service));
  router.get("/list", listRooms(service));
  router.get("/:id", getRoomById(service));
  router.post("/upload-images/:roomId", imageUpload.array('image'), uploadImages(service));
  router.get("/views-images/:filename", getImageByFilename(service));
  router.get("/list-images/:roomId", getImagesByRoomId(service));

  return router;
}