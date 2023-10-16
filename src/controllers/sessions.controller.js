import * as dotenv from "dotenv";
import { usersService } from "../repository/index.js";
import UsersDto from "../dao/DTOs/users.dto.js";
import { generateToken, isValidPassword, createHash } from "../utils/utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateSessionErrorInfo } from "../services/errors/info.js";

// Initialize services
dotenv.config();

// Variables
const JWT_SECRET = process.env.JWT_SECRET;

// Route that performs user registration
async function signupUser(req, res) {
  req.logger.info(`Usuario creado con éxito ${new Date().toLocaleString()}`);
  res.status(200).json({ message: "Usuario creado con éxito" });
}

// Route that executes when user registration fails
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

// Route that performs user login
async function loginUser(req, res, next) {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      const result = [username, password];
      req.logger.error(
        `Error de tipo de dato: Error de inicio de sesión ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error de inicio de sesión",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const result = await usersService.getOneUser(username);

      if (
        result.length === 0 ||
        !isValidPassword(result[0].password, password)
      ) {
        req.logger.error(
          `Error de base de datos: Usuario no encontrado ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Usuario no encontrado",
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

// Route that executes when user login fails
async function failLogin(req, res, next) {
  const result = [];
  req.logger.error(
    `Error de base de datos: Error al iniciar sessión ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Error de base de datos",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error al iniciar sessión",
    code: EErrors.DATABASE_ERROR,
  });
  return next();
}

// Route that recovers the password
async function forgotPassword(req, res) {
  const { username, newPassword } = req.body;
  try {
    if (!username || !newPassword) {
      const result = [username, newPassword];
      req.logger.error(
        `Error de tipo de dato: Error al actualizar la contraseña ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error al actualizar la contraseña",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const result = await usersService.getOneUser(username);

    if (result.length === 0) {
      req.logger.error(
        `Error de base de datos: Usuario no encontrado ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Usuario no encontrado",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
      );
      req.logger.info(
        `Contraseña actualizada con éxito ${new Date().toLocaleString()}`
      );
      res.status(200).json({
        response: "Contraseña actualizada con éxito",
      });
    }
  } catch (error) {
    next(error);
  }
}

// Route that returns the logged in user
async function currentUser(req, res) {
  const user = new UsersDto(req.user.user);
  res.status(200).json({ data: user });
}

// Github callback
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
