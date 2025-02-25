const Post = require("../models/post.model")
const mongoose = require("mongoose")
const logger = require("../utils/logger")
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")

dayjs.extend(relativeTime)

/**
 * Crée un post
 *
 * @route POST /post/
 */
exports.createPost = async (req, res, next) => {
  try {
    const { content, user, fileUrl, fileType, community } = req.body

    if (!content || !user) {
      logger.warn("⚠️ Champs manquants lors de la création du post.")
      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

    // TODO : Vérifier si l'utilisateur existe (par exemple avec un User.findById)

    const _id = new mongoose.Types.ObjectId()

    const post = new Post({
      _id,
      content,
      user,
      fileUrl,
      fileType,
      community,
      createAt: new Date(),
    })

    await post.save()
    logger.info(
      `✅ Post créé avec succès : ID ${_id} par l'utilisateur ${user}`
    )
    res.status(201).json({ message: "Post créé !" })
  } catch (error) {
    logger.error(`❌ Erreur lors de la création du post : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère les posts d'une communauté
 *
 * @route GET /community/:communityId
 */
exports.getCommunityPosts = async (req, res, next) => {
  try {
    const { communityId } = req.params
    const { limit = 10, skip = 0 } = req.query

    logger.info(
      `🔍 Tentative de récupération des posts pour la communauté : ${communityId}`
    )
    const posts = await Post.find({ community: communityId })
      .sort({
        createdAt: -1,
      })
      .populate("user", "name userName")
      .populate("community", "name")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean()

    const formattedPosts = posts.map((post) => ({
      ...post,
      createdAt: dayjs(post.createdAt).fromNow(),
    }))

    const totalCommunityPosts = await Post.countDocuments({
      community: communityId,
    })

    logger.info(`✅ Posts récupérés pour la communauté : ${communityId}`)
    logger.debug(`🔢 Nombre total de posts : ${totalCommunityPosts}`)
    res
      .status(200)
      .json({ posts: formattedPosts, totalCommunityPosts: totalCommunityPosts })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des posts pour la communauté (${req.params.communityId}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Modifie un post
 *
 * @route POST /modify/:id
 */
exports.modifyPost = async (req, res, next) => {
  try {
    const { content, fileUrl, fileType } = req.body
    const { id } = req.params

    logger.info(`🔧 Tentative de modification du post : ID ${id}`)
    const result = await Post.updateOne(
      { _id: id },
      { content, fileUrl, fileType }
    )

    if (result.nModified === 0) {
      logger.warn(`⚠️ Aucun changement détecté pour le post : ID ${id}`)
      return res.status(400).json({ message: "Aucune modification appliquée." })
    }

    logger.info(`✅ Post modifié avec succès : ID ${id}`)
    res.status(200).json({ message: "Post modifié !" })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la modification du post (ID ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Supprime un post
 *
 * @route POST /delete/:id
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params

    logger.info(`🗑️ Tentative de suppression du post : ID ${id}`)
    const result = await Post.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      logger.warn(`⚠️ Aucun post trouvé pour suppression : ID ${id}`)
      return res.status(404).json({ message: "Post non trouvé." })
    }

    logger.info(`✅ Post supprimé avec succès : ID ${id}`)
    res.status(200).json({ message: "Post supprimé !" })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la suppression du post (ID ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère un post
 *
 * @route GET /post/:id
 */
exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params

    logger.info(`🔍 Tentative de récupération du post : ID ${id}`)
    const post = await Post.findOne({ _id: id }).populate("user")

    if (!post) {
      logger.warn(`⚠️ Post non trouvé : ID ${id}`)
      return res.status(404).json({ error: "Post non trouvé." })
    }

    logger.info(`✅ Post récupéré avec succès : ID ${id}`)
    res.status(200).json(post)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération du post (ID ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}
