const User = require("../models/user.model")
const Post = require("../models/post.model")
const Community = require("../models/community.model")
const logger = require("../utils/logger") // Assurez-vous d'avoir un logger configuré
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")

require("dayjs/locale/fr")

dayjs.extend(relativeTime)
dayjs.locale("fr")

/**
 * Réccupère les informations d'un utilisateur
 *
 * @route GET /:id
 */
exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id
    logger.info(`🔍 Tentative de récupération du User : ${id}`)

    const user = await User.findById(id).select("-password").lean()
    logger.info(`✅ Utilisateur trouvé : ${user._id}`)

    const totalPosts = await Post.countDocuments({ user: user._id })
    logger.info(`📄 Total des posts de l'utilisateur : ${totalPosts}`)

    const communities = await Community.find({ members: user._id })
    const totalCommunities = communities.length
    logger.info(
      `👥 Total des communautés de l'utilisateur : ${totalCommunities}`
    )

    const postCommunities = await Post.find({ user: user._id }).distinct(
      "community"
    )
    const totalPostCommunities = postCommunities.length
    logger.info(
      `📄 Total des communautés où l'utilisateur a posté : ${totalPostCommunities}`
    )

    user.totalPosts = totalPosts
    user.totalCommunities = totalCommunities
    user.totalPostCommunities = totalPostCommunities

    const posts = await Post.find({ user: user._id })
      .populate("community", "name members")
      .limit(20)
      .lean()
      .sort({ createdAt: -1 })
    logger.info(`📄 Récupération des 20 derniers posts de l'utilisateur`)

    // Ajoute les publications à l'objet utilisateur, en indiquant si l'utilisateur est membre de chaque communauté
    user.posts = posts.map((post) => ({
      ...post,
      isMember: post.community?.members
        .map((member) => member.toString())
        .includes(user._id.toString()),
    }))
    logger.info(`✅ Posts de l'utilisateur traités`)

    res.status(200).json(user)
    logger.info(`✅ Réponse envoyée pour l'utilisateur : ${user._id}`)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des informations de l'utilisateur (${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}
