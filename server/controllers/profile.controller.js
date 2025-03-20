const User = require("../models/user.model")
const Post = require("../models/post.model")
const Community = require("../models/community.model")
const Relationship = require("../models/relationship.model")

const logger = require("../utils/logger")
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")

require("dayjs/locale/fr")

dayjs.extend(relativeTime)
dayjs.locale("fr")

/**
 * @route GET /users/public-users/:id
 *
 * @async
 * @function getPublicUser
 *
 * @param {string} req.params.id - L'identifiant de l'utilisateur réccupéré
 * @param {string} req.userId - L'identifiant de l'utilisateur actuel
 *
 * @description Récupère les informations publiques d'un utilisateur, y compris le nom, l'avatar, la localisation, la biographie, le rôle, les intérêts,
le nombre total de publications, la liste des communautés auxquelles l'utilisateur appartient, le nombre de followers et de followings,
si l'utilisateur actuel suit l'utilisateur, la date à laquelle l'utilisateur actuel a commencé à suivre l'utilisateur,
le nombre de publications créées par l'utilisateur au cours des 30 derniers jours, et les communautés communes entre l'utilisateur actuel et l'utilisateur.
 */
exports.getProfile = async (req, res) => {
  try {
    const currentUserId = req.userId
    logger.info(
      `🔍 Tentative de récupération du profil de l'utilisateur par : ${currentUserId}`
    )
    const id = req.params.id
    logger.info(`🔍 Tentative de récupération du User public ${id}`)

    const user = await User.findById(id)
      .select("-password -email -savedPosts -updatedAt")
      .lean()

    if (!user) {
      logger.warn(`⚠️ Utilisateur non trouvé : ${id}`)
      return res.status(404).json({ message: "Utilisateur non trouvé." })
    }
    logger.info(`✅ Utilisateur trouvé : ${user._id}`)

    const totalPosts = await Post.countDocuments({ user: user._id })
    logger.info(`📄 Total des posts de l'utilisateur : ${totalPosts}`)

    const communities = await Community.find({ members: user._id })
      .select("name")
      .lean()
    const totalCommunities = communities.length
    logger.info(
      `👥 Total des communautés de l'utilisateur : ${totalCommunities}`
    )

    const currentUserCommunities = await Community.find({
      members: currentUserId,
    })
      .select("_id name")
      .lean()

    const userCommunities = await Community.find({ members: user._id })
      .select("_id name")
      .lean()

    const commonCommunities = currentUserCommunities.filter((comm) => {
      return userCommunities.some((userComm) => userComm._id.equals(comm._id))
    })

    const isFollowing = await Relationship.findOne({
      follower: currentUserId,
      following: user._id,
    })

    logger.info(`👥 Status du follow de l'utilisateur : ${isFollowing}`)

    const followingSince = isFollowing
      ? dayjs(isFollowing.createdAt).fromNow()
      : null

    const last30Days = dayjs().subtract(30, "day").toDate()
    const postsLast30Days = await Post.aggregate([
      { $match: { user: user._id, createdAt: { $gte: last30Days } } },
      { $count: "total" },
    ])

    const totalPostsLast30Days =
      postsLast30Days.length > 0 ? postsLast30Days[0].total : 0

    const responseData = {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      avatar: user.avatar,
      location: user.location,
      bio: user.bio,
      interests: user.interests,
      totalPosts,
      communities,
      totalCommunities,
      joinedOn: dayjs(user.createdAt).format("MMM D, YYYY"),
      totalFollowers: user.followers?.length,
      totalFollowing: user.following?.length,
      isFollowing: !!isFollowing,
      followingSince,
      postsLast30Days: totalPostsLast30Days,
      commonCommunities,
    }

    res.status(200).json(responseData)
    logger.info(`✅ Réponse envoyée pour l'utilisateur public : ${user._id}`)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des informations de l'utilisateur public (${req.params.id}) : ${error.message}`
    )
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération de l'utilisateur.",
    })
  }
}

/**
 * Follow d'un utilisateur
 *
 * @param {string} req.params.id - L'identifiant de l'utilisateur suivi
 * @param {string} req.userId - L'identifiant de l'utilisateur qui suit
 *
 * @route POST /:followedId/follow
 */
exports.followUser = async (req, res) => {
  try {
    const { followedId } = req.params
    const followerId = req.userId

    if (!followedId || !followerId) {
      logger.warn(
        "⚠️ Le followerId ou le followedId est manquant. Follow: " +
          followedId +
          " Follower :" +
          followerId
      )
      return res.status(400).json({
        message: "Le followerId ou le followedId est manquant.",
      })
    }

    const relationshipExists = await Relationship.exists({
      follower: followerId,
      following: followedId,
    })

    if (relationshipExists) {
      return res.status(400).json({
        message: "L'utilisateur suit déjà cet utilisateur.",
      })
    }

    await Promise.all([
      User.findByIdAndUpdate(
        followedId,
        { $addToSet: { followers: followerId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followerId,
        { $addToSet: { following: followedId } },
        { new: true }
      ),
    ])

    await Relationship.create({ follower: followerId, following: followedId })

    logger.info(
      `✅ Utilisateur ${followerId} suit maintenant l'utilisateur ${followedId}.`
    )
    return res.status(200).json({ message: "Utilisateur suivi avec succès." })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la tentative de suivre l'utilisateur: ${error.message}`
    )
    return res.status(500).json({
      message: "Erreur lors de la tentative de suivre l'utilisateur.",
    })
  }
}

/**
 * Unfollow d'un utilisateur
 *
 * @param {string} req.params.id - L'identifiant de l'utilisateur suivi
 * @param {string} req.userId - L'identifiant de l'utilisateur qui suit
 *
 * @route POST /:followedId/unfollow
 */
exports.unfollowUser = async (req, res) => {
  try {
    const { followedId } = req.params
    const followerId = req.userId

    logger.info("Req :", req.body)

    if (!followedId || !followerId) {
      logger.warn(
        "⚠️ Le followerId ou le followedId est manquant. Follow: " +
          followedId +
          " Follower :" +
          followerId
      )
      return res.status(400).json({
        message: "Le followerId ou le followedId est manquant.",
      })
    }

    const relationshipExists = await Relationship.exists({
      follower: followerId,
      following: followedId,
    })

    if (!relationshipExists) {
      return res.status(400).json({
        message: "L'utilisateur ne suit pas cet utilisateur.",
      })
    }

    await Promise.all([
      User.findByIdAndUpdate(
        followedId,
        { $pull: { followers: followerId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followerId,
        { $pull: { following: followedId } },
        { new: true }
      ),
    ])

    await Relationship.findOneAndDelete({
      follower: followerId,
      following: followedId,
    })

    logger.info(
      `✅ Utilisateur ${followerId} ne suit plus l'utilisateur ${followedId}.`
    )
    return res.status(200).json({ message: "Utilisateur désuivi avec succès." })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la tentative de désuivre l'utilisateur (${followedId}) : ${error.message}`
    )
    return res.status(500).json({
      message: "Erreur lors de la tentative de désuivre l'utilisateur.",
    })
  }
}
