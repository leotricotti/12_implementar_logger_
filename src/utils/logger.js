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

  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
    )
  ),

  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = devLogger;
  req.logger.http(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
