import { productsService } from "../repository/index.js";

// Método asyncrono para obtener los productos en tiempo real
async function getProducts(req, res) {
  try {
    let result = await productsService.getAllProducts();
    if (!result) {
      res.status(404).json({ message: "Error al cargar los productos" });
    } else {
      res.json({ message: "Productos obtenidos con éxito", data: result });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los productos", data: err });
  }
}

// Método asyncrono para obtener un producto en tiempo real
async function getProduct(req, res) {
  const { id } = req.params;
  try {
    let result = await productsService.getOneProduct(id);
    if (!result) {
      res.status(404).json({ message: "Error al cargar el producto" });
    } else {
      res.json({ message: "Producto obtenido con éxito", data: result });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el producto", data: err });
  }
}

//Metodo asyncrono para guardar un producto
async function saveProduct(req, res) {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock) {
      res.status(400).json({ message: "Faltan datos" });
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
    res.status(500).json({ message: "Error al crear el producto", data: err });
  }
}

// Metodo asyncrono para eliminar un producto
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    let result = await productsService.deleteOneProduct(id);
    res.json({ message: "Producto eliminado con éxito", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", data: err });
  }
}
// Metodo asyncrono para actualizar un producto
async function updateProduct(req, res) {
  const { id } = req.params;
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    if (!title || !description || !price || !code || !stock) {
      res.status(400).json({ message: "Faltan datos" });
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
    res
      .status(500)
      .json({ message: "Error al actualizar el producto", data: err });
  }
}

export { getProducts, saveProduct, deleteProduct, updateProduct, getProduct };
