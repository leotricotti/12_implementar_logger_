export const generateProductErrorInfo = (product) => {
  return `One or more products are incomplet or invalid:
  * title: needs to be a string ${product.title}
  * description: needs to be a string ${product.description}
  * code: needs to be a string ${product.code}
  * price: needs to be a number ${product.price}
  * stock: needs to be a number ${product.stock}
  * category: needs to be a string ${product.category}
  * image: needs to be a string ${product.image}
`;
};
