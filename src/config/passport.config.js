import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import * as dotenv from "dotenv";
import GitHubStrategy from "passport-github2";
import { usersService } from "../repository/index.js";
import { createHash, isValidPassword } from "../utils.js";

// Inicializar servicios
dotenv.config();
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const ADMIN_ID = process.env.ADMIN_ID;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          //validar que el usuario exista en la base de datos
          let response = await usersService.getOneUser(
            jwt_payload.user.username
          );
          if (!response) {
            return done(null, false, { message: "Usuario inexistente" });
          } else {
            return done(null, jwt_payload);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Configurar passport para registrar usuarios
  passport.use(
    "register",
    new LocalStrategy(
      {
        session: false,
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        let role;
        if (username === ADMIN_ID || password === ADMIN_PASSWORD) {
          role = "admin";
        } else {
          role = "user";
        }
        try {
          const user = await usersService.getOneUser(username);
          if (user.length > 0) {
            return done(null, false, {
              message: "Error al crear el usuario. El usuario ya existe",
            });
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              password: createHash(password),
              role: role,
            };
            let result = await usersService.signupUser(newUser);
            return done(null, result);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  // Serializar y deserializar usuarios
  passport.serializeUser((user, done) => {
    done(null, user[0].email);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersService.getOneUser(id);
    done(null, user);
  });
};

// // Configurar cookie extractor
// const cookieExtractor = (req) => {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };

// Configurar passport para loguear usuarios con github
const githubStrategy = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        session: false,
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await usersService.getOneUser(profile?.emails[0]?.value);
          if (user.length === 1) {
            return done(null, user);
          } else {
            const newUser = {
              first_name: profile.displayName.split(" ")[0],
              last_name: profile.displayName.split(" ")[1],
              email: profile?.emails[0]?.value,
              password: "123",
            };
            const userNew = await usersService.signupUser(newUser);
            return done(null, userNew);
          }
        } catch (error) {
          return done("Error al crear el usuario", error);
        }
      }
    )
  );
};

export { initializePassport, githubStrategy };
