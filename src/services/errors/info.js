import EErrors from "./enum.js";

const generateProductErrorInfo = (product, errorType) => {
  let errorMessage = "";
  switch (errorType) {
    case EErrors.INVALID_TYPES_ERROR:
      errorMessage = `One or more products have invalid types:
        List of required types:
        * title: string ${typeof product.title}
        * description: string ${typeof product.description}
        * code: string ${typeof product.code}
        * price: number ${typeof product.price}
        * stock: number ${typeof product.stock}
        * category: string ${typeof product.category}
      `;
      break;
    case EErrors.DATABASE_ERROR:
      errorMessage = "Error al acceder a la base de datos";
      break;
    case EErrors.ROUTING_ERROR:
    default:
      errorMessage = "Error en la ruta";
      break;
  }
  return errorMessage;
};

export { generateProductErrorInfo };
