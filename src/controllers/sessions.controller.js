import * as dotenv from "dotenv";
import { usersService } from "../repository/index.js";
import UsersDto from "../dao/DTOs/users.dto.js";
import { generateToken, isValidPassword, createHash } from "../utils/utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";

//Inicializa servicios
dotenv.config();

//Variables
const JWT_SECRET = process.env.JWT_SECRET;

//Ruta que realiza el registro
async function signupUser(req, res) {
  try {
    res.status(200).json({ message: "Usuario creado con éxito" });
  } catch (err) {
    req.logger.error("Error al crear el usuario", err);
    const customError = new CustomError({
      name: "Error al crear el usuario",
      message: "Error al crear el usuario",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error al crear el usuario", data: customError });
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failRegister(req, res) {
  try {
    const customError = new CustomError({
      name: "Error al crear el usuario",
      message: "Error al crear el usuario",
      code: EErrors.DATABASE_ERROR,
    });
    res
      .status(500)
      .json({ message: "Error al crear el usuario", data: customError });
  } catch (err) {
    req.logger.error("Error al crear el usuario", err);
    const customError = new CustomError({
      name: "Error al crear el usuario",
      message: "Error al crear el usuario",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error al crear el usuario", data: customError });
  }
}

//Ruta que realiza el login
async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    const customError = new CustomError({
      name: "Error al iniciar sesión",
      message: "Error al iniciar sesión",
      code: EErrors.INVALID_TYPES_ERROR,
    });
    res
      .status(400)
      .json({ message: "Error al iniciar sesión", data: customError });
    return;
  }

  try {
    const result = await usersService.getOneUser(username);

    if (result.length === 0 || !isValidPassword(result[0].password, password)) {
      const customError = new CustomError({
        name: "Error al iniciar sesión",
        message: "Error al iniciar sesión",
        code: EErrors.INVALID_TYPES_ERROR,
      });
      res.status(401).json({
        respuesta: "Usuario o contraseña incorrectos",
        data: customError,
      });
      return;
    }

    const myToken = generateToken({
      first_name: result[0].first_name,
      username,
      password,
      role: result[0].role,
    });
    res.json({ message: "Login correcto", token: myToken });
  } catch (err) {
    req.logger.error("Error al iniciar sesión", err);
    const customError = new CustomError({
      name: "Error al iniciar sesión",
      message: "Error al iniciar sesión",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", data: customError });
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failLogin(req, res) {
  try {
    const customError = new CustomError({
      name: "Error al iniciar sesión",
      message: "Error al iniciar sesión",
      code: EErrors.DATABASE_ERROR,
    });
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", data: customError });
  } catch (err) {
    req.logger.error("Error al iniciar sesión", err);
    const customError = new CustomError({
      name: "Error al iniciar sesión",
      message: "Error al iniciar sesión",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", data: customError });
  }
}

//Ruta que recupera la contraseña
async function forgotPassword(req, res) {
  const { username, newPassword } = req.body;

  try {
    const result = await usersService.getOneUser(username);
    if (result.length === 0) {
      const customError = new CustomError({
        name: "Error al recuperar la contraseña",
        message: "Error al recuperar la contraseña",
        code: EErrors.INVALID_TYPES_ERROR,
      });
      res
        .status(401)
        .json({ respuesta: "El usuario no existe", data: customError });
      return;
    } else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
      );
      res.status(200).json({ respuesta: "Contraseña actualizada con éxito" });
    }
  } catch (err) {
    req.logger.error("Error al recuperar la contraseña", err);
    const customError = new CustomError({
      name: "Error al recuperar la contraseña",
      message: "Error al recuperar la contraseña",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error al recuperar la contraseña", data: customError });
  }
}

//Ruta que devuelve el usuario logueado
async function currentUser(req, res) {
  try {
    const user = new UsersDto(req.user.user);
    res.status(200).json({ data: user });
  } catch (err) {
    req.logger.error("Error al obtener el usuario actual", err);
    const customError = new CustomError({
      name: "Error al obtener el usuario actual",
      message: "Error al obtener el usuario actual",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res.status(500).json({
      message: "Error al obtener el usuario actual",
      data: customError,
    });
  }
}

//Callback de github
async function githubCallback(req, res) {
  try {
    req.user = req.user._json;
    res.redirect("/api/products?page=1");
  } catch (err) {
    req.logger.error("Error en el callback de GitHub", err);
    const customError = new CustomError({
      name: "Error en el callback de GitHub",
      message: "Error en el callback de GitHub",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    res
      .status(500)
      .json({ message: "Error en el callback de GitHub", data: customError });
  }
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
