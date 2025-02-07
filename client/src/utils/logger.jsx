import log from "loglevel"
import StackTrace from "stacktrace-js"

log.setLevel("info")

// Fonction pour récupérer l'origine de l'erreur
const getErrorSource = async () => {
  try {
    const stack = await StackTrace.get()
    const firstCall = stack[2] || stack[1] // 2 pour ignorer le logger lui-même
    return firstCall
      ? `[${firstCall.fileName}:${firstCall.lineNumber} - ${firstCall.functionName || "inconnue"}]`
      : "[Origine inconnue]"
  } catch (error) {
    return "[Origine inconnue]"
  }
}

const logger = {
  debug: (...args) => log.debug(new Date().toISOString(), ...args),
  info: (...args) => log.info(new Date().toISOString(), ...args),
  warn: (...args) => log.warn(new Date().toISOString(), ...args),

  error: async (...args) => {
    const source = await getErrorSource()
    log.error(new Date().toISOString(), source, ...args)
  },
}

export default logger
