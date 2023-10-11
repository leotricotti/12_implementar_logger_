import * as dotenv from "dotenv";
import { usersService } from "../repository/index.js";
import UsersDto from "../dao/DTOs/users.dto.js";
import { generateToken, isValidPassword, createHash } from "../utils/utils.js";

//Inicializa servicios
dotenv.config();

//Variables
const JWT_SECRET = process.env.JWT_SECRET;

//Ruta que realiza el registro
async function signupUser(req, res) {
  try {
    res.status(200).json({ message: "Usuario creado con éxito" });
  } catch (err) {
    req.req.logger.error("Error al crear el usuario", err);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failRegister(req, res) {
  try {
    res.status(500).json({ message: "Error al crear el usuario" });
  } catch (err) {
    req.logger.error("Error al crear el usuario", err);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
}

//Ruta que realiza el login
async function loginUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: "Error al iniciar sesión",
      data: "Faltan campos",
    });
  }

  try {
    const result = await usersService.getOneUser(username);

    if (result.length === 0 || !isValidPassword(result[0].password, password)) {
      res.status(401).json({
        respuesta: "Usuario o contraseña incorrectos",
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
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

//Ruta que se ejecuta cuando falla el registro
async function failLogin(req, res) {
  try {
    res.status(500).json({ message: "Error al iniciar sesión" });
  } catch (err) {
    req.logger.error("Error al iniciar sesión", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

//Ruta que recupera la contraseña
async function forgotPassword(req, res) {
  const { username, newPassword } = req.body;

  try {
    const result = await usersService.getOneUser(username);
    if (result.length === 0)
      return res.status(401).json({
        respuesta: "El usuario no existe",
      });
    else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
      );
      res.status(200).json({
        respuesta: "Contraseña actualizada con éxito",
      });
    }
  } catch (err) {
    req.logger.error("Error al recuperar la contraseña", err);
    res.status(500).json({ message: "Error al recuperar la contraseña" });
  }
}

//Ruta que devuelve el usuario logueado
async function currentUser(req, res) {
  try {
    const user = new UsersDto(req.user.user);
    res.status(200).json({ data: user });
  } catch (err) {
    req.logger.error("Error al obtener el usuario actual", err);
    res.status(500).json({ message: "Error al obtener el usuario actual" });
  }
}

//Callback de github
async function githubCallback(req, res) {
  try {
    req.user = req.user._json;
    res.redirect("/api/products?page=1");
  } catch (err) {
    req.logger.error("Error en el callback de GitHub", err);
    res.status(500).json({ message: "Error en el callback de GitHub" });
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
