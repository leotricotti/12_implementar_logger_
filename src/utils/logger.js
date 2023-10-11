import winston from "winston";

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
};

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,

  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
    }),

    new winston.transports.File({
      filename: "./erros.log",
      level: "error",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger =
    process.env.ENVIRONMENT === "production" ? devLogger : prodLogger;
  const { body } = req;
  let bodyData = { ...body };

  if (req.method === "POST" || req.method === "PUT") {
    bodyData = JSON.stringify(bodyData);
  } else {
    bodyData = "";
  }

  req.logger.http(
    `ruta:${req.method} ${
      req.url
    } - ${new Date().toLocaleTimeString()} - data:${bodyData}`
  );
  next();
};
