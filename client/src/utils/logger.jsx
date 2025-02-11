import log from "loglevel"
import StackTrace from "stacktrace-js"
import chalk from "chalk"

log.setLevel("info")

const icons = {
  debug: "🐛",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
}

const colors = {
  debug: chalk.blue,
  info: chalk.green,
  warn: chalk.yellow,
  error: chalk.red.bold,
}

const getErrorSource = async () => {
  try {
    const stack = await StackTrace.get()
    const firstCall = stack[2] || stack[1] // Ignore le logger lui-même
    return firstCall
      ? `[${chalk.cyan(firstCall.fileName)}:${chalk.magenta(firstCall.lineNumber)} - ${chalk.gray(firstCall.functionName || "inconnue")}]`
      : "[Origine inconnue]"
  } catch (error) {
    return "[Origine inconnue]"
  }
}

const logger = {
  debug: (...args) =>
    log.debug(
      colors.debug(`${icons.debug} [DEBUG]`),
      chalk.gray(new Date().toISOString()),
      ...args,
    ),
  info: (...args) =>
    log.info(
      colors.info(`${icons.info} [INFO]`),
      chalk.gray(new Date().toISOString()),
      ...args,
    ),
  warn: (...args) =>
    log.warn(
      colors.warn(`${icons.warn} [WARN]`),
      chalk.gray(new Date().toISOString()),
      ...args,
    ),

  error: async (...args) => {
    const source = await getErrorSource()
    log.error(
      colors.error(`${icons.error} [ERROR]`),
      chalk.gray(new Date().toISOString()),
      source,
      ...args,
    )
  },
}

export default logger
