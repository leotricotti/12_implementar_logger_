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
  colors: {
    fatal: "red",
    error: "orange",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "purple",
  },
};

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,

  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],

  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
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

  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
});

export const addLogger = (req, res, next) => {
  req.logger =
    process.env.ENVIRONMENT === "production" ? prodLogger : devLogger;

  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );

  next();
};
