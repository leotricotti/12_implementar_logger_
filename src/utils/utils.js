import passport from "passport";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateAuthErrorInfo } from "../services/errors/info.js";

//Variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//Encriptar contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (savedPassword, password) => {
  return bcrypt.compareSync(password, savedPassword);
};

// Función que recibe un objeto de usuario y genera un token JWT.
const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

// Función que verifica si el token se ha enviado en la solicitud y si es válido.
const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    req.logger.error(
      `Error de autenticación. Error al autenticar el usuario ${new Date().toLocaleString()}`
    );
  CustomError.createError({
    name: "Error de autenticación",
    cause: generateAuthErrorInfo(authHeader, EErrors.AUTH_ERROR),
    message: "Error al autenticar el usuario",
    code: EErrors.AUTH_ERROR,
  });
  res.status(401).json({ error: "Error de autenticacion" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      req.logger.error(
        `Error de autenticación. Error al verificar token ${new Date().toLocaleString()}`
      );
    CustomError.createError({
      name: "Error de autenticación",
      cause: generateAuthErrorInfo(token, EErrors.AUTH_ERROR),
      message: "Error al verificar token",
      code: EErrors.AUTH_ERROR,
    });
    res.status(403).json({ error: "Token invalido" });

    req.user = user;
    next();
  });
};

// Esta función para autenticar a los usuarios.
const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info) {
      if (error) {
        req.logger.error(
          `Error de autenticación. Usuario no autorizado ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de autenticación",
          cause: generateAuthErrorInfo(error, EErrors.AUTH_ERROR),
          message: "Usuario no autorizado",
          code: EErrors.AUTH_ERROR,
        });
        return next(error);
      }
      if (!user) {
        req.logger.error(
          `Error de autenticación. Usuario no autenticado ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de autenticación",
          cause: generateAuthErrorInfo(user, EErrors.AUTH_ERROR),
          message: "Usuario no autenticado",
          code: EErrors.AUTH_ERROR,
        });
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

//Función que verifica si un usuario tiene permisos para acceder a una ruta determinada
const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user.user) {
      req.logger.error(
        `Error de autenticación. Usuario no autorizado ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de autenticación",
        cause: generateAuthErrorInfo(req.user, EErrors.AUTH_ERROR),
        message: "Usuario no autorizado",
        code: EErrors.AUTH_ERROR,
      });
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (req.user.user.role != role) {
      req.logger.error(
        `Error de autenticación. Usuario sin permisos ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de autenticación",
        cause: generateAuthErrorInfo(role, EErrors.AUTH_ERROR),
        message: "Usuario sin permisos",
        code: EErrors.AUTH_ERROR,
      });
      return res.status(403).send({ error: "No permissions" });
    }
    next();
  };
};

// Función que genera productos aleatorios
function generateProducts() {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.product(),
    price: faker.commerce.price(),
    stock: faker.number.init,
    category: faker.commerce.department(),
    image: faker.image.url(),
  };
}

export {
  generateToken,
  passportCall,
  authorization,
  authToken,
  generateProducts,
};
