import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJWT from 'passport-jwt';

import { ServicePort } from "../../../domain/user/port";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export const passportConfigure = (service: ServicePort) => {
    const authenticateUser = async (email: string, password: string, done: any) => {
        try {
            const _user = await service.authenticateUserByEmail(email, password);
            return done(null, _user);
        } catch (error) {
            return done(null, false, { message: 'Authentication Failed' });
        }
    };
    const localStrategy = new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        (email, password, done) => { return authenticateUser(email, password, done) }
    );
    const jwtStrategy = new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        (jwtPayload, done) => {
            return done(null, jwtPayload);
        }
    );

    passport.use(localStrategy);
    passport.use(jwtStrategy);

    passport.serializeUser((user, done) => {
        console.log(`--------> Serialize User`)
        console.log(user)
        done(null, user)
    });

    passport.deserializeUser((user, done) => {
        console.log("---------> Deserialize Id")
        console.log(user)

        done(null, user as Express.User)
    })
}
