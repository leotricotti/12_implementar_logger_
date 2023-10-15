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
  req.logger.info(`User created successfully ${new Date().toLocaleString()}`);
  res.status(200).json({ message: "User created successfully" });
}

// Route that executes when user registration fails
async function failRegister(req, res, next) {
  const result = [];
  req.logger.error(
    `Database error: Error creating user ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Database error",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error creating user",
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
        `Data type error: Error logging in ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Data type error",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error logging in",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const result = await usersService.getOneUser(username);

      if (
        result.length === 0 ||
        !isValidPassword(result[0].password, password)
      ) {
        req.logger.error(
          `Database error: Error getting user ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Database error",
          cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error getting user",
          code: EErrors.DATABASE_ERROR,
        });
      } else {
        const myToken = generateToken({
          first_name: result[0].first_name,
          username,
          password,
          role: result[0].role,
        });
        req.logger.info(`Login successful ${new Date().toLocaleString()}`);
        res.json({ message: "Login successful", token: myToken });
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
    `Database error: Error logging in ${new Date().toLocaleString()}`
  );
  CustomError.createError({
    name: "Database error",
    cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
    message: "Error logging in",
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
        `Data type error: Error updating password ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Data type error",
        cause: generateSessionErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error updating password",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const result = await usersService.getOneUser(username);

    if (result.length === 0) {
      req.logger.error(
        `Database error: Error getting user ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Database error",
        cause: generateSessionErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error getting user",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      const updatePassword = await usersService.updateUserPassword(
        result[0]._id,
        createHash(newPassword)
      );
      req.logger.info(
        `Password updated successfully ${new Date().toLocaleString()}`
      );
      res.status(200).json({
        response: "Password updated successfully",
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
