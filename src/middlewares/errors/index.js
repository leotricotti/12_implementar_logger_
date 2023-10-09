import EErrors from "../../services/errors/enum";

export default function (err, req, res, next) {
  console.log(err.cause);
  switch (err.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.send({ status: "error", error: err.name });
      break;
    default:
      res.send({ status: "error", error: "Unhadled error" });
      break;
  }
}
