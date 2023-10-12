import { ticketsService } from "../repository/index.js";
import { cartService } from "../repository/index.js";
import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateTicketErrorInfo } from "../services/errors/info.js";

//Metodo asyncrono para finalizar la compra
async function finishPurchase(req, res, next) {
  const { username, totalPurchase, products } = req.body;
  const { cid } = req.params;

  try {
    if (!username || !totalPurchase || !products || !cid) {
      const result = [username, totalPurchase, products, cid];
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateTicketErrorInfo(result, EErrors.INVALID_TYPES_ERROR),
        message: "Error al finalizar la compra",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const cart = await cartService.getOneCart(cid);

    // Filtrar los productos que no tienen stock
    const productWithOutStock = await products.filter((product) =>
      product.product.stock < product.quantity ? true : false
    );

    // Filtrar los productos que tienen stock
    const productWithStock = await products.filter((product) =>
      product.product.stock > product.quantity ? true : false
    );

    // Actualizar el stock de los productos que se compraron
    productWithStock.map(async (product) => {
      const newStock = product.product.stock - product.quantity;
      await productsService.updateOneProduct(product.product._id, {
        stock: newStock,
      });
    });

    // Calcular el descuento por los productos que no tienen stock
    const missingProductDiscount = await productWithOutStock.reduce(
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
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateTicketErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al crear el ticket",
          code: EErrors.DATABASE_ERROR,
        });
      }

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
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateTicketErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al crear el ticket",
          code: EErrors.DATABASE_ERROR,
        });
      }

      res.json({
        message:
          "Compra realizada con éxito. Los siguietes productos no se pudieron comprar por falta de stock:",
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
