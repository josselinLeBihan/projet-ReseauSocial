const { createLogger, format, transports } = require("winston")

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "server.log" }),
  ],
})

module.exports = logger
