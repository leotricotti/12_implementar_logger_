import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// Método asyncrono para obtener todos los Productsos
async function getAll(req, res, next) {
  const { page, sort, category } = req.query;
  try {
    if (category) {
      const filteredProducts = await productsService.filteredAllProducts(
        category
      );
      if (filteredProducts.length === 0) {
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateProductErrorInfo(
            filteredProducts,
            EErrors.DATABASE_ERROR
          ),
          message: "Error al obtener los productos filtrados",
          code: EErrors.DATABASE_ERROR,
        });
      }
      res.json({
        products: filteredProducts.docs,
      });
    } else if (sort) {
      const orderedProducts = []; // await productsService.orderedAllProducts(sort);
      if (orderedProducts.length === 0) {
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateProductErrorInfo(
            orderedProducts,
            EErrors.DATABASE_ERROR
          ),
          message: "Error al obtener los productos ordenados",
          code: EErrors.DATABASE_ERROR,
        });
      }
      res.json({
        products: orderedProducts,
      });
    } else {
      const paginatedProducts = await productsService.paginatedAllProducts(
        page
      );
      if (paginatedProducts.length === 0) {
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateProductErrorInfo(
            paginatedProducts,
            EErrors.DATABASE_ERROR
          ),
          message: "Error al obtener los productos paginados",
          code: EErrors.DATABASE_ERROR,
        });
      }
      res.json({
        products: paginatedProducts.docs,
      });
    }
  } catch (err) {
    next(err);
  }
}

export { getAll };
