import { productsService } from "../repository/index.js";

// Método asyncrono para obtener todos los productos
async function getAll(req, res) {
  const { page, sort, category } = req.query;
  try {
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
      const paginatedProducts = await productsService.paginatedAllProducts(
        page
      );
      res.json({
        products: paginatedProducts.docs,
      });
    }
  } catch (err) {
    logger.error("Error al obtener los productos.", err);
    res.status(500).json({
      message: "Error al obtener los productos.",
      data: err,
    });
  }
}

export { getAll };
