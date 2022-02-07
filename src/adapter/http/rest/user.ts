import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import { User, UserAvatar } from '../../../domain/user/user';
import { ServicePort } from "../../../domain/user/port";
import path from "path";
import multer from "multer";

const createUserValidationSchema: Schema = {
  fullName: {
    isString: {
      errorMessage: 'Formato inválido!'
    },
    isLength: {
      errorMessage: 'Nome completo precisa ter pelo menos 10 caracteres!',
      options: { min: 10 }
    }
  },
  email: {
    isString: {
      errorMessage: 'Formato inválido!'
    },
    isEmail: {
      errorMessage: 'Email invalido!',
      options: {}
    }
  }
}

export const createUser = (service: ServicePort) => async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array().map(({ param, msg }) => ({ field: param, message: msg })) })
  }
  try {
    const token: object = await service.createUser(req.body as User);
    res.status(HttpStatusCodes.CREATED).json(token);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const authenticateUser = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { cpf, password } = req.body;
    const token: object = await service.authenticateUserByEmail(cpf, password);
    res.status(HttpStatusCodes.OK).json(token);
  } catch (err) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: (err as Error).message });
    console.log((err as Error))
  }
}

export const uploadAvatar = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const _files = req.files as Express.Multer.File[];
    const _userAvatar = _files.map((file) => {
      return {
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        userId: parseInt(userId)
      }
    })
    await service.uploadAvatars(_userAvatar);
    console.log(req.files)
    res.status(HttpStatusCodes.CREATED).json(_userAvatar);
  } catch (err) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: (err as Error).message });
  }
}

export const getAvatarByFilename = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { filename } = req.params
    const _userAvatar = await service.getAvatarByFilename(filename) as UserAvatar;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, _userAvatar.filepath);
    res.status(HttpStatusCodes.OK).type(_userAvatar.mimetype).sendFile(fullfilepath);
  } catch (err) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: (err as Error).message });
  }
}

export const getAvatarByUserId = (service: ServicePort) => async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const _userAvatar = await service.getAvatarsByUserId(parseInt(userId));
    res.status(HttpStatusCodes.OK).json(_userAvatar);
  } catch (err) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ error: (err as Error).message });
  }
}

export default function configureUserRouter(service: ServicePort): IRouter {
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

  router.post("/register", checkSchema(createUserValidationSchema), createUser(service));
  router.post("/authenticate", authenticateUser(service));
  router.post("/upload-images/:userId", imageUpload.array('image'), uploadAvatar(service));
  router.get("/views-images/:filename", getAvatarByFilename(service));
  router.get("/list-images/:userId", getAvatarByUserId(service));

  return router;
}