export const generateProductErrorInfo = (product) => {
  console.log("entro a generateProductErrorInfo");
  return `One or more products are incomplet or invalid:
  List of required fields:
  * title: needs to be a string ${product.title}
  * description: needs to be a string ${product.description}
  * code: needs to be a string ${product.code}
  * price: needs to be a number ${product.price}
  * stock: needs to be a number ${product.stock}
  * category: needs to be a string ${product.category}
`;
};
