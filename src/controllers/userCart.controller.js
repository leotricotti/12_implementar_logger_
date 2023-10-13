import { usersService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateUserCartErrorInfo } from "../services/errors/info.js";

//Ruta que agrega el id del carrito al usuario
async function userCart(req, res) {
  const { cartId, email } = req.body;
  try {
    if (!cartId || !email) {
      req.logger.error(
        `Error de tipo de dato: Error al cargar el carrito ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateUserCartErrorInfo(carts, EErrors.INVALID_TYPES_ERROR),
        message: "Error al cargar el carrito",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const user = await usersService.getOneUser(email);
    if (user.length === 0) {
      req.logger.error(
        `Error de base de datos: Error al cargar el carrito ${new Date().toLocaleString()}`
      );
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateUserCartErrorInfo(user, EErrors.DATABASE_ERROR),
        message: "Error al cargar el carrito",
        code: EErrors.DATABASE_ERROR,
      });
    }
    const userId = user[0]._id;
    const cartExist = user[0].carts.find((cart) => cart == cartId);
    if (!cartExist) {
      user[0].carts.push(cartId);
      const respuesta = await usersService.updateUserCart(userId, user[0]);
      if (!respuesta) {
        req.logger.error(
          `Error de base de datos: Error al actualizar el carrito ${new Date().toLocaleString()}`
        );
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateCartErrorInfo(newCart, EErrors.DATABASE_ERROR),
          message: "Error al actualizar el carrito",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } else {
      req.logger.info(
        `Carrito actualizado con éxito ${new Date().toLocaleString()}`
      );
      res.json({
        message: "Carrito actualizado con éxito",
        data: respuesta,
      });
    }
  } catch (err) {
    next(err);
  }
}

export default userCart;
