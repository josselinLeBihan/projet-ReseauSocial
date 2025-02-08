const Community = require("../models/community.model")
const LOG = console.log
/**
 * Réccupère jusqu'à 10 communautés auxquelles l'utilisateur n'appartient pas
 * Inclu leur noms, leur bannière, le nombre de membres
 * Elles sont triées par nombre de membres décroissant
 *
 * @route GET /communities/notmember
 */
exports.getNotMemberCommunities = (req, res, next) => {}

/**
 * Réccupère toutes les communautés auxquelles l'utilisateur appartient
 * Inclu les ID des communautés, leur noms, leur bannière, le nombre de membres et leur description
 *
 * @route GET /communities/member
 */
exports.getMemberCommunities = (req, res, next) => {}

/**
 * Réccupère les membres d'une communauté
 *
 * @route GET /communities/:name/members
 */
exports.getCommunityMembers = (req, res, next) => {}

/**
 * Réccupère les informations d'une communauté
 *
 * @route GET /communities/:name
 */
exports.getCommunity = (req, res, next) => {
  Community.findOne({ name: req.params.name })
    .then((community) => res.status(200).json(community))
    .catch((error) => {
      console.error("Database error:", error)
      res.status(400).json({ error })
    })
}

/**
 * Réccupère TOUTES les communautés
 *
 * @route GET /communities
 */
exports.getCommunities = (req, res, next) => {
  Community.find()
    .then((communities) => res.status(200).json(communities))
    .catch((error) => {
      console.error("Database erreur:", error)
      res.status(400).json({ error })
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
      return res.status(400).json({
        message: "Le userId ou le communityId est manquant",
      })
    }

    const oldCommunity = await Community.findById(communityId)

    if (oldCommunity.members.includes(userId)) {
      return res.status(400).json({
        message: "L'utilisateur appartient déjà à la communauté",
      })
    }

    const newCommunity = await Community.findOneAndUpdate(
      { _id: communityId },
      {
        $push: {
          members: userId,
        },
      },
      { new: true }
    )

    if (!newCommunity) {
      return res.status(404).json({
        message: "Communauté non trouvée",
      })
    }

    return res.status(200).json(newCommunity)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Erreur lors de la tentative de rejoindre la communauté",
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
      return res.status(400).json({
        message: "Le userId ou le communityId est manquant",
      })
    }

    const oldCommunity = await Community.findById(communityId)

    if (!oldCommunity.members.includes(userId)) {
      return res.status(400).json({
        message: "L'utilisateur n'appartient déjà pas à la communauté",
      })
    }

    const newCommunity = await Community.findOneAndUpdate(
      { _id: communityId },
      {
        $pull: {
          members: userId,
        },
      },
      { new: true }
    )

    if (!newCommunity) {
      return res.status(404).json({
        message: "Communauté non trouvée",
      })
    }

    return res.status(200).json(newCommunity)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Erreur lors de la tentative de rejoindre la communauté",
    })
  }
}
