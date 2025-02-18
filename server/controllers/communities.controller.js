const Community = require("../models/community.model")
const logger = require("../utils/logger") // Import du logger Winston

/**
 * Récupère jusqu'à 10 communautés auxquelles l'utilisateur n'appartient pas
 * Inclut leur nom, bannière, et le nombre de membres
 * Triées par nombre de membres décroissant
 *
 * @route GET /communities/notmember
 */
exports.getNotMemberCommunities = async (req, res, next) => {
  try {
    const userId = req.user._id

    const communities = await Community.find({ members: { $ne: userId } })
      .sort({ members: -1 }) // Tri décroissant par nombre de membres
      .limit(10)
      .select("name banner members") // On sélectionne uniquement les champs nécessaires

    logger.info(
      `✅ Récupération des communautés non-membre pour l'utilisateur ${userId}.`
    )

    res.status(200).json(
      communities.map((community) => ({
        name: community.name,
        banner: community.banner,
        membersCount: community.members.length,
      }))
    )
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des communautés non-membre : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère toutes les communautés auxquelles l'utilisateur appartient
 * Inclut les IDs des communautés, leur nom, bannière, nombre de membres et description
 *
 * @route GET /communities/member
 */
exports.getMemberCommunities = async (req, res, next) => {
  try {
    const userId = req.user._id

    const communities = await Community.find({ members: userId }).select(
      "_id name banner description members"
    )

    logger.info(
      `✅ Récupération des communautés membre pour l'utilisateur ${userId}.`
    )

    res.status(200).json(
      communities.map((community) => ({
        id: community._id,
        name: community.name,
        banner: community.banner,
        description: community.description,
        membersCount: community.members.length,
      }))
    )
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des communautés membre : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère les membres d'une communauté
 *
 * @route GET /communities/:name/members
 */
exports.getCommunityMembers = async (req, res, next) => {
  try {
    const { name } = req.params

    const community = await Community.findOne({ name }).select("members")

    if (!community) {
      logger.warn(`⚠️ Communauté non trouvée : ${name}`)
      return res.status(404).json({ error: "Communauté non trouvée." })
    }

    logger.info(`✅ Membres récupérés pour la communauté : ${name}`)
    res.status(200).json(community.members)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des membres de la communauté (${name}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère les informations d'une communauté
 *
 * @route GET /communities/:name
 */
exports.getCommunity = (req, res, next) => {
  Community.findOne({ name: req.params.name })
    .then((community) => {
      if (!community) {
        logger.warn(`⚠️ Communauté non trouvée : ${req.params.name}`)
        return res.status(404).json({ error: "Communauté non trouvée." })
      }

      logger.info(`✅ Détails de la communauté récupérés : ${req.params.name}`)
      res.status(200).json(community)
    })
    .catch((error) => {
      logger.error(
        `❌ Erreur lors de la récupération de la communauté (${req.params.name}) : ${error.message}`
      )
      res.status(500).json({ error: "Une erreur est survenue." })
    })
}

/**
 * Récupère toutes les communautés
 *
 * @route GET /communities
 */
exports.getCommunities = (req, res, next) => {
  Community.find()
    .then((communities) => {
      logger.info("✅ Récupération de toutes les communautés.")
      res.status(200).json(communities)
    })
    .catch((error) => {
      logger.error(
        `❌ Erreur lors de la récupération des communautés : ${error.message}`
      )
      res.status(500).json({ error: "Une erreur est survenue." })
    })
}

/**
 * Rejoindre une communauté
 *
 * @route POST /communities/:name/join
 */
exports.joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params
    const { userId } = req.body

    if (!communityId || !userId) {
      logger.warn("⚠️ Le userId ou le communityId est manquant.")
      return res.status(400).json({
        message: "Le userId ou le communityId est manquant.",
      })
    }

    const oldCommunity = await Community.findById(communityId)

    if (oldCommunity.members.includes(userId)) {
      logger.warn(
        `⚠️ L'utilisateur ${userId} appartient déjà à la communauté ${communityId}.`
      )
      return res.status(400).json({
        message: "L'utilisateur appartient déjà à la communauté.",
      })
    }

    const newCommunity = await Community.findOneAndUpdate(
      { _id: communityId },
      { $push: { members: userId } },
      { new: true }
    )

    if (!newCommunity) {
      logger.warn(`⚠️ Communauté non trouvée : ${communityId}`)
      return res.status(404).json({ message: "Communauté non trouvée." })
    }

    logger.info(
      `✅ Utilisateur ${userId} ajouté à la communauté ${communityId}.`
    )
    return res.status(200).json(newCommunity)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la tentative de rejoindre la communauté (${communityId}) : ${error.message}`
    )
    return res.status(500).json({
      message: "Erreur lors de la tentative de rejoindre la communauté.",
    })
  }
}

/**
 * Quitter une communauté
 *
 * @route POST /communities/:name/leave
 */
exports.leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params
    const { userId } = req.body

    if (!communityId || !userId) {
      logger.warn("⚠️ Le userId ou le communityId est manquant.")
      return res.status(400).json({
        message: "Le userId ou le communityId est manquant.",
      })
    }

    const oldCommunity = await Community.findById(communityId)

    if (!oldCommunity.members.includes(userId)) {
      logger.warn(
        `⚠️ L'utilisateur ${userId} n'appartient pas à la communauté ${communityId}.`
      )
      return res.status(400).json({
        message: "L'utilisateur n'appartient pas à la communauté.",
      })
    }

    const newCommunity = await Community.findOneAndUpdate(
      { _id: communityId },
      { $pull: { members: userId } },
      { new: true }
    )

    if (!newCommunity) {
      logger.warn(`⚠️ Communauté non trouvée : ${communityId}`)
      return res.status(404).json({ message: "Communauté non trouvée." })
    }

    logger.info(
      `✅ Utilisateur ${userId} retiré de la communauté ${communityId}.`
    )
    return res.status(200).json(newCommunity)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la tentative de quitter la communauté (${communityId}) : ${error.message}`
    )
    return res.status(500).json({
      message: "Erreur lors de la tentative de quitter la communauté.",
    })
  }
}
