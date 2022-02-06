import { IRouter, Request, Response, Router } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";
import HttpStatusCodes from 'http-status-codes';

import { User } from '../../../domain/user/user';
import { ServicePort } from "../../../domain/user/port";

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

export default function configureUserRouter(service: ServicePort): IRouter {
  const router: IRouter = Router();

  router.post("/register", checkSchema(createUserValidationSchema), createUser(service));
  router.post("/authenticate", authenticateUser(service));

  return router;
}