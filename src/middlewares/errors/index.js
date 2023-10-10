import EErrors from "../../services/errors/enum.js";

export default (err, req, res, next) => {
  switch (err.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.send({
        status: "err",
        err: "holaaaaa",
      });
      break;
    case EErrors.DATABASE_ERROR:
      res.send({
        status: "err",
        err: err.name,
      });
      break;
    case EErrors.ROUTING_ERROR:
      res.send({
        status: "err",
        err: err.name,
      });
      break;
    default:
      res.send({
        status: "err",
        err: "unhandled err",
      });
      break;
  }
};
