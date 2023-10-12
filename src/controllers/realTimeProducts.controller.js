import { productsService } from "../repository/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

// Método asyncrono para obtener los productos en tiempo real
async function getProducts(req, res, next) {
  try {
    let result = await productsService.getAllProducts();
    if (result.length === 0) {
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateProductErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error al obtener los productos",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      res.json({ message: "Productos obtenidos con éxito", data: result });
    }
  } catch (err) {
    next(err);
  }
}

// Método asyncrono para obtener un producto en tiempo real
async function getProduct(req, res, next) {
  const { id } = req.params;
  try {
    if (!id) {
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateProductErrorInfo(id, EErrors.INVALID_TYPES_ERROR),
        message: "Error al obtener su productos",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    let result = await productsService.getOneProduct(id);
    if (result.length === 0) {
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateProductErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error al obtener su productos",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      res.json({ message: "Producto obtenido con éxito", data: result });
    }
  } catch (err) {
    next(err);
  }
}

//Metodo asyncrono para guardar un producto
async function saveProduct(req, res, next) {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock || !category) {
      const data = { title, description, code, price, stock, category };
      CustomError.createError({
        name: "Error de tipo de datos",
        cause: generateProductErrorInfo(data, EErrors.INVALID_TYPES_ERROR),
        message: "Error al crear el producto",
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

      if (!result) {
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateProductErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al crear el producto",
          code: EErrors.DATABASE_ERROR,
        });
      }
      res.json({ message: "Producto creado con éxito", data: product });
    }
  } catch (err) {
    next(err);
  }
}

// Metodo asyncrono para eliminar un producto
async function deleteProduct(req, res, next) {
  const { id } = req.params;
  try {
    if (!id) {
      CustomError.createError({
        name: "Error de tipo de dato",
        cause: generateProductErrorInfo(id, EErrors.INVALID_TYPES_ERROR),
        message: "Error al eliminar el producto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    let result = await productsService.deleteOneProduct(id);
    if (result.length === 0) {
      CustomError.createError({
        name: "Error de base de datos",
        cause: generateProductErrorInfo(result, EErrors.DATABASE_ERROR),
        message: "Error al eliminar el producto",
        code: EErrors.DATABASE_ERROR,
      });
    } else {
      res.json({ message: "Producto eliminado con éxito", data: result });
    }
  } catch (err) {
    next(err);
  }
}
// Metodo asyncrono para actualizar un producto
async function updateProduct(req, res) {
  const { id } = req.params;
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock) {
      const data = { title, description, code, price, stock, category };
      CustomError.createError({
        name: "Error de tipo de datos",
        cause: generateProductErrorInfo(data, EErrors.INVALID_TYPES_ERROR),
        message: "Error al actualizar el producto",
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
      if (!result) {
        CustomError.createError({
          name: "Error de base de datos",
          cause: generateProductErrorInfo(result, EErrors.DATABASE_ERROR),
          message: "Error al actualizar el producto",
          code: EErrors.DATABASE_ERROR,
        });
      }
      res.json({ message: "Producto actualizado con éxito", data: product });
    }
  } catch (err) {
    next(err);
  }
}

export { getProducts, saveProduct, deleteProduct, updateProduct, getProduct };
