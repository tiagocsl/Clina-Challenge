import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import { User, UserAvatar } from '../../../domain/user/user';
import { AuthenticatorPort, ServicePort } from "../../../domain/user/port";
import path from "path";
import multer from "multer";
import passport from "passport";

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
    let _token;
    passport.authenticate('local', { session: false }, (err, user) => {
      if (err || !user) throw new Error("Email ou senha inválidos!");
      req.login(user, { session: false }, async (err) => {
        if (err) throw new Error(err);

        const { email, password } = req.body;
        _token = await service.authenticateUserByEmail(email, password);
        res.status(HttpStatusCodes.OK).json(_token);
      })
    })(req, res);
  } catch (err) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: (err as Error).message });
    console.log((err as Error))
  }
}

export const uploadAvatar = (service: ServicePort, authenticator: AuthenticatorPort) => async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId: number = await (await authenticator.getUserTokenClaim(String(token).split(' ')[1])).id
    const _files = req.files as Express.Multer.File[];
    const _userAvatar = _files.map((file) => {
      return {
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        userId: userId
      }
    })
    await service.uploadAvatars(_userAvatar);
    console.log(req.files)
    res.status(HttpStatusCodes.CREATED).json(_userAvatar);
  } catch (err) {
    const error = (err as Error);
    if (error.message == "invalid signature")
      res.status(HttpStatusCodes.FORBIDDEN).json(error)
    else
      res.status(HttpStatusCodes.BAD_REQUEST).json(error);
  }
}

export const getAvatarByFilename = (service: ServicePort, authenticator: AuthenticatorPort) => async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId: number = await (await authenticator.getUserTokenClaim(String(token).split(' ')[1])).id
    const { filename } = req.params
    const _userAvatar = await service.getAvatarByFilename(filename, userId) as UserAvatar;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, _userAvatar.filepath);
    res.status(HttpStatusCodes.OK).type(_userAvatar.mimetype).sendFile(fullfilepath);
  } catch (err) {
    const error = (err as Error);
    if (error.message == "invalid signature")
      res.status(HttpStatusCodes.FORBIDDEN).json(error)
    else
      res.status(HttpStatusCodes.BAD_REQUEST).json(error);
  }
}

export const getAvatarsByUserId = (service: ServicePort, authenticator: AuthenticatorPort) => async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId: number = await (await authenticator.getUserTokenClaim(String(token).split(' ')[1])).id
    const _userAvatar = await service.getAvatarsByUserId(userId);
    res.status(HttpStatusCodes.OK).json(_userAvatar);
  } catch (err) {
    const error = (err as Error);
    if (error.message == "invalid signature")
      res.status(HttpStatusCodes.FORBIDDEN).json(error)
    else
      res.status(HttpStatusCodes.BAD_REQUEST).json(error);
  }
}

export default function configureUserRouter(service: ServicePort, authenticator: AuthenticatorPort): IRouter {
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
  router.post("/upload-images", imageUpload.array('image'), uploadAvatar(service, authenticator));
  router.get("/views-images/:filename", getAvatarByFilename(service, authenticator));
  router.get("/list-images", getAvatarsByUserId(service, authenticator));

  return router;
}