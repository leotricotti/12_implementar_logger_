import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// Método asyncrono para obtener todos los productos
async function getAll(req, res) {
  const { page, sort, category } = req.query;
  if (category) {
    const filteredProducts = await productsService.filteredAllProducts(
      category
    );
    res.json({
      products: filteredProducts.docs,
    });
  } else if (sort) {
    const orderedProducts = await productsService.orderedAllProducts(sort);
    res.json({
      products: orderedProducts,
    });
  } else {
    const paginatedProducts = await productsService.paginatedAllProduct(page);
    res.json({
      products: paginatedProducts.docs,
    });
  }
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

export { getAll };
