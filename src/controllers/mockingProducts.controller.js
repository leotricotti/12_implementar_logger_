import { generateProducts } from "../utils/utils.js";

const getProducts = (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }

  res.json({ message: "Success", data: products });
};

export default getProducts;
