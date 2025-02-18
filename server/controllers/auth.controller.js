const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Token = require("../models/token.model")
const User = require("../models/user.model")
const logger = require("../utils/logger") // Import du logger Winston

exports.signup = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body

    if (!name || !email || !password || !userName) {
      logger.warn("⚠️ Champs manquants lors de l'inscription !")
      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

    if (await User.findOne({ userName })) {
      logger.warn(`⚠️ Nom d'utilisateur déjà existant : ${userName}`)
      return res.status(400).json({
        error: "Il existe déjà un compte avec ce nom d'utilisateur.",
      })
    }

    if (await User.findOne({ email })) {
      logger.warn(`⚠️ Email déjà existant : ${email}`)
      return res.status(400).json({
        error: "Il existe déjà un compte avec cette email.",
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      userName,
      password: hash,
    })

    await user.save()
    logger.info(`✅ Nouvel utilisateur créé : ${userName} (${email})`)
    res.status(201).json({ message: "Utilisateur créé !" })
  } catch (error) {
    logger.error(
      "❌ Erreur lors de la création de l'utilisateur :",
      error.message
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      logger.warn(`🔍 Utilisateur non trouvé avec l'email : ${req.body.email}`)
      return res
        .status(401)
        .json({ error: "Paire identifiant/mot de passe incorrecte !" })
    }

    logger.info(`🔍 Utilisateur trouvé : ${user.userName} (${user.email})`)

    const valid = await bcrypt.compare(req.body.password, user.password)

    if (!valid) {
      logger.warn(`❌ Mot de passe incorrect pour : ${user.email}`)
      return res
        .status(401)
        .json({ error: "Paire identifiant/mot de passe incorrecte !" })
    }

    logger.info(`✅ Mot de passe valide pour : ${user.email}`)

    const payload = {
      id: user._id,
      email: user.email,
    }

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    })

    logger.info(`🔑 Token JWT généré pour : ${user.email}`)
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
      },
    })
    logger.info(`✅ Utilisateur connecté avec succès : ${user.email}`)
  } catch (error) {
    logger.error("❌ Erreur lors du processus de connexion :", error.message)
    res.status(500).json({ error: "Une erreur interne est survenue." })
  }
}

exports.logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1] ?? null
    if (accessToken) {
      await Token.deleteOne({ accessToken })
      logger.info("🔒 Token supprimé avec succès lors de la déconnexion.")
    }
    res.status(200).json({
      message: "Déconnexion réussie.",
    })
    logger.info("✅ Déconnexion réussie.")
  } catch (err) {
    logger.error("❌ Erreur lors de la déconnexion :", err.message)
    res.status(500).json({
      message: "Une erreur interne est survenue.",
    })
  }
}
