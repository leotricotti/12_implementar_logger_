import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// Método asyncrono para obtener todos los productos
async function getAll(req, res) {
  const { page, sort, category } = req.query;
  let filteredProducts;
  let orderedProducts;
  let paginatedProducts;

  if (category) {
    filteredProducts = await productsService.filteredAllProducts(category);
    req.logger.info(
      `Se obtuvieron los productos correctamente. ${new Date().toLocaleString()}`
    );
    res.json({
      products: filteredProducts.docs,
    });
  } else if (sort) {
    orderedProducts = await productsService.orderedAllProducts(sort);
    req.logger.info(
      `Se obtuvieron los productos correctamente. ${new Date().toLocaleString()}`
    );
    res.json({
      products: orderedProducts,
    });
  } else {
    paginatedProducts = await productsService.paginatedAllProducts(page);
    req.logger.info(
      `Se obtuvieron los productos correctamente. ${new Date().toLocaleString()}`
    );
    res.json({
      products: paginatedProducts.docs,
    });
  }
  if (!filteredProducts && !orderedProducts && !paginatedProducts) {
    req.logger.error(
      `Este es un error fatal. ${new Date().toLocaleTimeString()}`
    );
    CustomError.createError({
      name: "Error al obtener los productos",
      cause: generateProductErrorInfo(),
      message: "Error al obtener los productos",
      code: EErrors.DATABASE_ERROR,
    });
  }
}

export { getAll };
