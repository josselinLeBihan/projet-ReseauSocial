const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Token = require("../models/token.model")
const User = require("../models/user.model")
const logger = require("../utils/logger") // Import du logger Winston

/**
 * Récupère les informations d'un utilisateur
 *
 * @route GET /:id
 */
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    logger.info(
      `🔍 Tentative de récupération des informations pour l'utilisateur : ${userId}`
    )

    const user = await User.findById(userId)

    if (!user) {
      logger.warn(`⚠️ Utilisateur non trouvé : ${userId}`)
      return res.status(404).json({ error: "Utilisateur non trouvé." })
    }

    logger.info(`✅ Utilisateur récupéré avec succès : ${userId}`)
    res.status(200).json(user)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération de l'utilisateur (ID : ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}
