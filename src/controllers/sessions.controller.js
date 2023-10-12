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
  res.status(200).json({ message: "Usuario creado con éxito" });
}

//Ruta que se ejecuta cuando falla el registro
async function failRegister(req, res, next) {
  const result = [];
  CustomError.createError({
    name: "Error de sesión",
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
      CustomError.createError({
        name: "Error de sesión",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error al iniciar sesion",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const result = await usersService.getOneUser(username);
      console.log(result);

      if (
        result.length === 0 ||
        !isValidPassword(result[0].password, password)
      ) {
        CustomError.createError({
          name: "Error de sesión",
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
        res.json({ message: "Login correcto", token: myToken });
      }
    }
  } catch (error) {
    next(error);
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failLogin(req, res, next) {
  const result = [];
  CustomError.createError({
    name: "Error de sesión",
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
      CustomError.createError({
        name: "Error de sesión",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error al iniciar sesion",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const result = await usersService.getOneUser(username);

    if (result.length === 0) {
      CustomError.createError({
        name: "Error de sesión",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error al obtener el usuario",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
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
