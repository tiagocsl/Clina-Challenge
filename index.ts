import http, { Server } from 'http';
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';

import PostgresStorage from './src/adapter/storage/postgres/storage';
import configureRouter from './src/adapter/http/rest/router';
import JWTAuthenticator from './src/adapter/authenticator/jwt/authenticator';
import BCryptCryptor from './src/adapter/cryptor/bcrypt/encryptor';

import UserService from './src/domain/user/service';
import RoomService from './src/domain/room/service';
import AgendaService from './src/domain/schedule/service';

//const auth = passport.authenticate('jwt', { session: false });

const run = async (): Promise<void> => {
    const storage: PostgresStorage = new PostgresStorage();
    const authenticator: JWTAuthenticator = new JWTAuthenticator(process.env.JWT_SECRET as string);
    const cryptor: BCryptCryptor = new BCryptCryptor();

    const userService: UserService = new UserService(storage, authenticator, cryptor);
    const roomService: RoomService = new RoomService(storage);
    const agendaService: AgendaService = new AgendaService(storage, roomService);

    const app: Application = express();
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    (await import('./src/adapter/authenticator/passport/passport')).passportConfigure(userService);

    app.use("/api", configureRouter(
        userService,
        roomService,
        agendaService,
        authenticator
    ));

    const server: Server = http.createServer(app);

    const port: number = parseInt(process.env.PORT || "") || 3000;

    server.listen(port, () => {
        console.log(`Server's running on port: ${port}`);
    });
}

run().catch(console.error);