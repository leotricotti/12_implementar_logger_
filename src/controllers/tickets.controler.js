import { ticketsService } from "../repository/tickets.js";
import { cartService } from "../repository/cart.js";
import { productsService } from "../repository/products.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateTicketErrorInfo } from "../services/errors/info.js";

async function finishPurchase(req, res, next) {
  const { username, totalPurchase, products } = req.body;
  const { cid } = req.params;

  try {
    if (!username || !totalPurchase || !products || !cid) {
      req.logger.error(
        `Error de tipo de dato: Error al finalizar la compra ${new Date().toLocaleString()}`
      );
      throw CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateTicketErrorInfo(
          [username, totalPurchase, products, cid],
          EErrors.INVALID_TYPES_ERROR
        ),
        message: "Error al finalizar la compra",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const cart = await cartService.getOneCart(cid);
    if (cart.length === 0) {
      req.logger.error(
        `Error de base de datos: Error al finalizar la compra ${new Date().toLocaleString()}`
      );
      throw CustomError.createError({
        name: "Error de base de datos",
        cause: generateTicketErrorInfo(cart, EErrors.DATABASE_ERROR),
        message: "Error al finalizar la compra",
        code: EErrors.DATABASE_ERROR,
      });
    }

    const productWithOutStock = products.filter(
      (product) => product.product.stock < product.quantity
    );
    const productWithStock = products.filter(
      (product) => product.product.stock > product.quantity
    );

    await Promise.all(
      productWithStock.map(async (product) => {
        const newStock = product.product.stock - product.quantity;
        await productsService.updateOneProduct(product.product._id, {
          stock: newStock,
        });
      })
    );

    const missingProductDiscount = productWithOutStock.reduce(
      (acc, product) => {
        return acc + product.product.price * product.quantity * 0.85;
      },
      0
    );

    if (productWithOutStock.length === 0) {
      cart.products = [];
      const result = await cartService.updateOneCart(cid, cart);

      const newTicket = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date().toLocaleString(),
        amount: totalPurchase,
        purchaser: username,
      };

      const ticket = await ticketsService.createOneTicket(newTicket);
      if (!ticket) {
        req.logger.error({
          message: `Error de base de datos: Error al crear el ticket ${new Date().toLocaleString()}`,
        });
        throw CustomError.createError({
          name: "Error de base de datos",
          cause: generateTicketErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al crear el ticket",
          code: EErrors.DATABASE_ERROR,
        });
      }

      req.logger.info(
        `Compra realizada con éxito ${new Date().toLocaleString()}`
      );
      res.json({
        message: "Compra realizada con éxito",
        data: ticket,
        products: productWithStock,
      });
    } else {
      cart.products = [...productWithOutStock];
      const result = await cartService.updateOneCart(cid, cart);
      const remainingProducts = await cartService.getOneCart(cid);

      const newTicket = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date().toLocaleString(),
        amount: (totalPurchase - missingProductDiscount).toFixed(2),
        purchaser: username,
      };

      const ticket = await ticketsService.createOneTicket(newTicket);
      if (!ticket) {
        throw CustomError.createError({
          name: "Error de base de datos",
          cause: generateTicketErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al crear el ticket",
          code: EErrors.DATABASE_ERROR,
        });
      }

      req.logger.info(
        `Compra realizada con éxito ${new Date().toLocaleString()}`
      );
      res.json({
        message:
          "Compra realizada con éxito. Los siguientes productos no se pudieron comprar por falta de stock:",
        data: ticket,
        remainingProducts: productWithOutStock,
        products: productWithStock,
      });
    }
  } catch (err) {
    next(err);
  }
}

export { finishPurchase };
