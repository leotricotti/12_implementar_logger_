import * as dotenv from "dotenv";
import { usersService } from "../repository/index.js";
import UsersDto from "../dao/DTOs/users.dto.js";
import { generateToken, isValidPassword, createHash } from "../utils/utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateSessionErrorInfo } from "../services/errors/info.js";

//Inicializa servicios
dotenv.config();

//Variables
const JWT_SECRET = process.env.JWT_SECRET;

//Ruta que realiza el registro
async function signupUser(req, res) {
  req.logger.info(`Usuario creado con éxito ${new Date().toLocaleString()}`);
  res.status(200).json({ message: "Usuario creado con éxito" });
}

//Ruta que se ejecuta cuando falla el registro
async function failRegister(req, res, next) {
  const result = [];
  req.logger.error(
    `Error de base de datos: Error al crear el usuario ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Error de base de datos",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error al crear el usuario",
    code: EErrors.DATABASE_ERROR,
  });
  next();
}

//Ruta que realiza el login
async function loginUser(req, res, next) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      const result = [username, password];
      req.logger.error(
        `Error de tipo de dato: Error al iniciar sesión ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "FError al iniciar sesión",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const result = await usersService.getOneUser(username);

      if (
        result.length === 0 ||
        !isValidPassword(result[0].password, password)
      ) {
        req.logger.error(
          `Error de base de datos: Error al obtener el usuario ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al obtener el usuario",
          code: EErrors.DATABASE_ERROR,
        });
      } else {
        const myToken = generateToken({
          first_name: result[0].first_name,
          username,
          password,
          role: result[0].role,
        });
        req.logger.info(
          `Login realizado con éxito ${new Date().toLocaleString()}`
        );
        res.json({ message: "Login realizado con éxito", token: myToken });
      }
    }
  } catch (error) {
    next(error);
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failLogin(req, res, next) {
  const result = [];
  req.logger.error(
    `Error de base de datos: Error al iniciar sesion ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Error de base de datos",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error al iniciar sesion",
    code: EErrors.DATABASE_ERROR,
  });
  return next();
}

//Ruta que recupera la contraseña
async function forgotPassword(req, res) {
  const { username, newPassword } = req.body;
  try {
    if (!username || !newPassword) {
      const result = [username, newPassword];
      req.logger.error(
        `Error de tipo de dato: Error al actualizar contraseña ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error al actualizar contraseña",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const result = await usersService.getOneUser(username);

    if (result.length === 0) {
      req.logger.error(
        `Error de base de datos: Error al obtener el usuario ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error al obtener el usuario",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
      );
      req.logger.info(
        `Contrseña actualizada con éxito ${new Date().toLocaleString()}`
      );
      res.status(200).json({
        respuesta: "Contrseña actualizada con éxito",
      });
    }
  } catch (error) {
    next(error);
  }
}

//Ruta que devuelve el usuario logueado
async function currentUser(req, res) {
  const user = new UsersDto(req.user.user);
  res.status(200).json({ data: user });
}

//Callback de github
async function githubCallback(req, res) {
  req.user = req.user._json;
  res.redirect("/api/products?page=1");
}

export {
  signupUser,
  failRegister,
  loginUser,
  failLogin,
  currentUser,
  forgotPassword,
  githubCallback,
};
