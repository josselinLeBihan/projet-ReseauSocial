const mongoose = require("mongoose")
const logger = require("../utils/logger")

mongoose.set("strictQuery", false)
class Database {
  constructor(uri, options) {
    this.uri = uri
    this.options = options
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, this.options)
      logger.info(
        `✅ Connection à la base de donnée: ${mongoose.connection.db.databaseName}`
      )
    } catch (error) {
      throw error
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      logger.info(
        `🔌Déconnecté de la base de donnée: ${mongoose.connection.db.databaseName}`
      )
    } catch (error) {
      throw error
    }
  }
}

module.exports = Database
