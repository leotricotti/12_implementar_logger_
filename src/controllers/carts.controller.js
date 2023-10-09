import { cartService } from "../repository/index.js";

//Método asyncrono para obtener todos los carritos
async function getAll(req, res) {
  try {
    const carts = await cartService.getAllCarts();
    res.json({ carts });
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener los carritos",
      data: err,
    });
  }
}

//Método asyncrono para obtener un carrito
async function getOne(req, res) {
  const { cid } = req.params;
  try {
    const cart = await cartService.getOneCart(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      data: err,
    });
  }
}

//Método asyncrono para popular el carrito
async function populatedCart(req, res) {
  const { cid } = req.params;
  try {
    const cart = await cartService.populatedOneCart(cid);
    if (cart) {
      res.json({ message: "Carrito populado con éxito", data: cart });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el carrito",
      data: err,
    });
  }
}

//Método asyncrono para crear un carrito
async function createCart(req, res) {
  try {
    const newCart = req.body;
    const result = await cartService.saveOneCart(newCart);
    res.json({ message: "Carrito creado con éxito", data: newCart });
  } catch (err) {
    res.status(500).json({ message: "Error al crear el carrito ", data: err });
  }
}

async function manageCartProducts(req, res) {
  const { cid, pid } = req.params;
  const { op } = req.body;

  try {
    const cart = await cartService.getOneCart(cid);
    const productExist = cart.products.findIndex((product) =>
      product.product == pid ? true : false
    );

    if (productExist === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      if (op === "add") {
        cart.products[productExist].quantity += 1;
      } else if (op === "substract") {
        cart.products[productExist].quantity -= 1;
      }
    }

    const result = await cartService.updateOneCart(cid, cart);

    res.json({ message: "Carrito actualizado con éxito", data: cart });
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar el carrito",
      data: err,
    });
  }
}

//Método asyncrono para eliminar productos del carrito
async function deleteProduct(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartService.getOneCart(cid);

    let productExistsInCarts = cart.products.findIndex(
      (dato) => dato.product == pid
    );

    cart.products.splice(productExistsInCarts, 1);

    const result = await cartService.updateOneCart(cid, cart);

    res.json({ message: "Producto eliminado con éxito", data: cart });
  } catch (err) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
      data: err,
    });
  }
}

//Método asyncrono para vaciar el carrito
async function emptyCart(req, res) {
  const { cid } = req.params;
  try {
    const cart = await cartService.getOneCart(cid);
    if (cart) {
      cart.products = [];
      const result = await cartService.updateOneCart(cid, cart);
      res.json({ message: "Carrito vaciado con éxito", data: cart });
    } else {
      res.status(404).json({
        message: "Carrito no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al vaciar el carrito",
      data: err,
    });
  }
}

export {
  getAll,
  getOne,
  createCart,
  manageCartProducts,
  deleteProduct,
  emptyCart,
  populatedCart,
};
