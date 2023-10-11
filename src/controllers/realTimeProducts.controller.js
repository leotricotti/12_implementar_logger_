import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// Método asyncrono para obtener los productos en tiempo real
async function getProducts(req, res) {
  try {
    let result = await productsService.getAllProducts();
    if (!result) {
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateProductErrorInfo(EErrors.DATABASE_ERROR),
        message: "Error al cargar los productos",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
    }
  } catch (err) {
    const customError = CustomError.createError({
      name: "Error al obtener los productos",
      message: "Error al obtener los productos",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    req.logger.error(customError);
    res.status(500).json({
      message: "Error al obtener los productos",
      data: generateProductErrorInfo(customError, EErrors.DATABASE_ERROR),
    });
  }
}

// Método asyncrono para obtener un producto en tiempo real
async function getProduct(req, res) {
  const { id } = req.params;
  try {
    let result = await productsService.getOneProduct(id);
    if (!result) {
      throw new CustomError({
        name: "Error al cargar el producto",
        message: "Error al cargar el producto",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      res.json({ message: "Producto obtenido con éxito", data: result });
    }
  } catch (err) {
    const customError = new CustomError({
      name: "Error al obtener el producto",
      message: "Error al obtener el producto",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    req.logger.error(customError);
    res.status(500).json({
      message: "Error al obtener el producto",
      data: generateProductErrorInfo(customError, EErrors.DATABASE_ERROR),
    });
  }
}

//Metodo asyncrono para guardar un producto
async function saveProduct(req, res) {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock || !category) {
      throw new CustomError({
        name: "Error al crear el producto",
        cause: generateProductErrorInfo(
          {
            title,
            description,
            code,
            price,
            stock,
            category,
          },
          EErrors.INVALID_TYPES_ERROR
        ),
        message: "Faltan datos",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const product = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category,
        thumbnail: thumbnail,
      };
      let result = await productsService.saveOneProduct(product);
      res.json({ message: "Producto creado con éxito", data: product });
    }
  } catch (err) {
    const customError = new CustomError({
      name: "Error al crear el producto",
      message: "Error al crear el producto",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    req.logger.error(customError);
    res.status(500).json({
      message: "Error al crear el producto",
      data: generateProductErrorInfo(customError, EErrors.DATABASE_ERROR),
    });
  }
}

// Metodo asyncrono para eliminar un producto
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    let result = await productsService.deleteOneProduct(id);
    res.json({ message: "Producto eliminado con éxito", data: result });
  } catch (err) {
    const customError = new CustomError({
      name: "Error al eliminar el producto",
      message: "Error al eliminar el producto",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    req.logger.error(customError);
    res.status(500).json({
      message: "Error al eliminar el producto",
      data: generateProductErrorInfo(customError, EErrors.DATABASE_ERROR),
    });
  }
}
// Metodo asyncrono para actualizar un producto
async function updateProduct(req, res) {
  const { id } = req.params;
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock) {
      throw new CustomError({
        name: "Error al actualizar el producto",
        message: "Faltan datos",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      const product = {
        title: title,
        description: description,
        code: code,
        price: price,
        stock: stock,
        category: category,
        thumbnail: thumbnail,
      };
      let result = await productsService.updateOneProduct(id, product);
      res.json({ message: "Producto actualizado con éxito", data: product });
    }
  } catch (err) {
    const customError = new CustomError({
      name: "Error al actualizar el producto",
      message: "Error al actualizar el producto",
      code: EErrors.DATABASE_ERROR,
      cause: err,
    });
    req.logger.error(customError);
    res.status(500).json({
      message: "Error al actualizar el producto",
      data: generateProductErrorInfo(customError, EErrors.DATABASE_ERROR),
    });
  }
}

export { getProducts, getProduct, saveProduct, deleteProduct, updateProduct };
