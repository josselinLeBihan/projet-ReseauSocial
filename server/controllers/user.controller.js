const User = require("../models/user.model")
const Post = require("../models/post.model")
const Community = require("../models/community.model")
const logger = require("../utils/logger")
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")
const { getPosts } = require("../utils/postService")
const { formatPost } = require("../utils/postFormatter")
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
    if (!user) {
      logger.warn(`⚠️ Utilisateur introuvable : ${id}`)
      return res.status(404).json({ error: "Utilisateur introuvable." })
    }
    logger.info(`✅ Utilisateur trouvé : ${user._id}`)

    // Récupérer les statistiques de l'utilisateur
    const totalPosts = await Post.countDocuments({ user: user._id })
    const communities = await Community.find({ members: user._id })
    const totalCommunities = communities.length
    const postCommunities = await Post.find({ user: user._id }).distinct(
      "community"
    )
    const totalPostCommunities = postCommunities.length

    logger.info(`📄 Total des posts de l'utilisateur : ${totalPosts}`)
    logger.info(
      `👥 Total des communautés de l'utilisateur : ${totalCommunities}`
    )
    logger.info(
      `📄 Total des communautés où l'utilisateur a posté : ${totalPostCommunities}`
    )

    // Ajouter les statistiques à l'utilisateur
    user.totalPosts = totalPosts
    user.totalCommunities = totalCommunities
    user.totalPostCommunities = totalPostCommunities

    // Récupérer les 20 derniers posts de l'utilisateur
    const posts = await getPosts(
      { user: user._id },
      { limit: 20, sort: { createdAt: -1 }, populate: ["community"] }
    )

    // Formater les posts et ajouter l'information `isMember`
    user.posts = posts.map((post) => ({
      ...formatPost(post),
      isMember: post.community?.members
        .map((member) => member.toString())
        .includes(user._id.toString()),
    }))

    logger.info(`✅ Posts de l'utilisateur traités`)
    res.status(200).json(user)

    logger.debug(
      `✅ Réponse envoyée pour l'utilisateur : Name: ${user.name} - Email: ${user.email} - ID: ${user._id} - Total Posts: ${totalPosts} - Total Communities: ${totalCommunities} - Total Post Communities: ${totalPostCommunities} - Avatar: ${user.avatar}`
    )
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des informations de l'utilisateur (${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * @route PUT /users/:id
 */
exports.updateInfo = async (req, res) => {
  try {
    logger.info(
      `🔄 Tentative de mise à jour des informations de l'utilisateur : ${req.userId}`
    )

    const user = await User.findById(req.userId)
    if (!user) {
      logger.warn(`⚠️ Utilisateur introuvable : ${req.userId}`)
      return res.status(404).json({
        message: "User introuvable",
      })
    }

    const { name, email, location, interests, bio } = req.body
    logger.info(
      `📥 Données reçues : location=${location}, interests=${interests}, bio=${bio}`
    )

    const defaultAvatar =
      "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg"
    const fileUrl = req.files?.[0]?.filename
      ? `${req.protocol}://${req.get("host")}/assets/userAvatars/${
          req.files[0].filename
        }`
      : defaultAvatar

    logger.info(`🖼️ Avatar mis à jour : ${fileUrl}`)

    user.name = name
    user.email = email
    user.location = location
    user.interests = interests
    user.bio = bio
    user.avatar = fileUrl

    await user.save()
    logger.info(
      `✅ Informations de l'utilisateur mises à jour avec succès : ${req.userId}`
    )

    res.status(200).json({
      message: "Mise a jour des info réussie",
    })
  } catch (err) {
    logger.error(
      `❌ Erreur lors de la mise à jour des informations de l'utilisateur : ${err.message}`
    )
    res.status(500).json({
      message: "Erreur lors de la mise à jours des infos",
    })
  }
}
