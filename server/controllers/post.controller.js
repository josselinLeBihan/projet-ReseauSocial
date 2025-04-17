const Post = require("../models/post.model")
const Community = require("../models/community.model")
const User = require("../models/user.model")
const mongoose = require("mongoose")
const logger = require("../utils/logger")
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")
const { formatPost } = require("../utils/postFormatter")
const { getPosts } = require("../utils/postService")

require("dayjs/locale/fr")

dayjs.extend(relativeTime)
dayjs.locale("fr")

/**
 * Crée un post
 *
 * @route POST /post/
 */
exports.createPost = async (req, res, next) => {
  try {
    const { content, user, fileUrl, fileType, community } = req.body

    if (!content || !user) {
      return res.status(400).json({
        error: `Tous les champs sont requis. Content: ${content} User: ${user}`,
      })

      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

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
    logger.info(
      `📄 Contenu du post : ${content} Fichier: ${fileUrl} Type de fichier: ${fileUrl}`
    )
    res.status(201).json({ message: "Post créé !" })
  } catch (error) {
    logger.error(`❌ Erreur lors de la création du post : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Réccupère le feed d'un utilisateur
 *
 * @route POST /post/
 */
exports.getUserFeed = async (req, res, next) => {
  try {
    const { userId } = req.params

    if (!userId) {
      logger.warn(`⚠️ UserId manquant lors de la récupération du feed.`)
      return res.status(400).json({
        error: `Tous les champs sont requis.`,
      })
    }

    const { limit = 10, skip = 0 } = req.query

    const user = await User.findById(userId)
    if (!user) {
      logger.warn(`⚠️ Utilisateur introuvable : ${userId}`)
      return res.status(404).json({
        message: "User introuvable",
      })
    }

    //réccuperer les posts de l'utilisateur
    const userPosts = await getPosts(
      userId,
      { user: user._id },
      { limit, skip, populate: ["user"] }
    )

    //réccupérer les posts des communautés suivie
    const communities = await Community.find({ members: user._id })
    const communityPosts = (
      await Promise.all(
        communities.map((community) =>
          getPosts(
            userId,
            { community: community._id },
            { limit, skip, populate: ["user"] }
          )
        )
      )
    ).flat()

    logger.debug(
      `🔢 Nombre total de posts de communauté réccupéré : ${communityPosts.length}`
    )

    //réccupérer les posts des personnes suivie
    const followingPosts = await getPosts(
      userId,
      { user: { $in: user.following } },
      { limit, skip, populate: ["user"] }
    )

    logger.debug(
      `🔢 Nombre total de posts de personnes suivie réccupéré : ${followingPosts.length}`
    )

    const allPosts = [...userPosts, ...communityPosts, ...followingPosts]
      .reduce((unique, post) => {
        if (!unique.some((p) => p._id.toString() === post._id.toString())) {
          unique.push(post)
        }
        return unique
      }, [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)

    //formater les posts
    const formattedPosts = allPosts.map(formatPost)

    logger.info(`📄 Récupération des 20 derniers posts du feed`)
    res.status(200).json(formattedPosts)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération du feed de l'utilisateur Erreur: ${error.message}`
    )
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
    const userId = req.userId
    const { limit = 10, skip = 0 } = req.query

    logger.info(
      `🔍 Tentative de récupération des posts pour la communauté : ${communityId}`
    )
    const posts = await getPosts(
      userId,
      { community: communityId },
      { limit, skip, populate: ["user", "community"] }
    )

    const formattedPosts = posts.map(formatPost)

    const totalCommunityPosts = await Post.countDocuments({
      community: communityId,
    })

    logger.info(`✅ Posts récupérés pour la communauté : ${communityId}`)
    logger.debug(`🔢 Nombre total de posts : ${totalCommunityPosts}`)
    res.status(200).json({
      posts: formattedPosts,
      totalCommunityPosts: totalCommunityPosts,
    })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des posts pour la communauté (${req.params.communityId}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère les posts d'un utilisateur
 *
 * @route GET /post/:userId
 */
exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { limit = 10, skip = 0 } = req.query

    logger.info(
      `🔍 Tentative de récupération des posts pour l'utilisateur : ${userId}`
    )
    const posts = await getPosts(
      userId,
      { user: userId },
      { limit, skip, populate: ["user", "community"] }
    )

    const formattedPosts = posts.map(formatPost)

    const totalUserPosts = await Post.countDocuments({
      user: userId,
    })

    logger.info(`✅ Posts récupérés pour l'utilisateur : ${userId}`)
    logger.debug(`🔢 Nombre total de posts : ${totalUserPosts}`)
    res
      .status(200)
      .json({ posts: formattedPosts, totalUserPosts: totalUserPosts })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des posts pour l'utilisateur (${req.params.userId}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Récupère les posts sauvegardés d'un utilisateur
 *
 * @route GET /post/saved
 */
exports.getSavedPosts = async (req, res, next) => {
  try {
    const userId = req.userId
    const { limit = 10, skip = 0 } = req.query

    logger.info(
      `🔍 Tentative de récupération des posts sauvegardés pour l'utilisateur : ${userId}`
    )

    const user = await User.findById(userId)

    const posts = await getPosts(
      userId,
      { _id: { $in: user.savedPosts } },
      { limit, skip, populate: ["user", "community"] }
    )

    const formattedPosts = posts.map(formatPost)

    const totalUserPosts = user.savedPosts.length

    logger.info(`✅ Posts récupérés pour l'utilisateur : ${userId}`)
    logger.debug(`🔢 Nombre total de posts : ${totalUserPosts}`)
    res
      .status(200)
      .json({ posts: formattedPosts, totalUserPosts: totalUserPosts })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération des posts pour l'utilisateur (${req.params.userId}) : ${error.message}`
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

    const modifiedAt = new Date()

    const result = await Post.updateOne(
      { _id: id },
      { content, fileUrl, fileType, modifiedAt }
    )

    if (result.Modified === 0) {
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
 * @route GET /:id
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

    const formattedPost = formatPost(post.toObject())
    logger.info(`✅ Post récupéré avec succès : ID ${id}`)
    res.status(200).json(formattedPost)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération du post (ID ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Like un post
 *
 * @route POST /unlike/:id/:userId
 */
exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    userId = req.userId

    if (!postId || !userId) {
      logger.warn("⚠️ Champs manquants lors du like.")
      return res.status(400).json({
        error: `Tous les champs sont requis. Id: ${postId} UserId: ${userId}`,
      })
    }

    logger.info(
      `🔍 Tentative de like du post par un utilisateur: ID ${postId} User ${userId}`
    )
    const post = await Post.findOne({ _id: postId }).populate("user")
    if (!post) {
      logger.error("❌ Erreur lors de la récupération du post")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du post Post: ${postId} UserId: ${userId}`,
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      logger.error("❌ Erreur lors de la récupération de l'utilisateur")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du post Post: ${postId} UserId: ${userId}`,
      })
    }

    await Post.updateOne({ _id: postId }, { $push: { likes: userId } })
    res.status(200).json({ message: "Post liké avec succès !" })

    logger.info(`✅ Post liké avec succès : ID ${postId}`)
  } catch (error) {
    logger.error(`❌ Erreur lors du like du post : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Unike un post
 *
 * @route POST /like/:id/:userId
 */
exports.unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    userId = req.userId

    if (!postId || !userId) {
      logger.warn("⚠️ Champs manquants lors du unlike.")
      return res.status(400).json({
        error: `Tous les champs sont requis. Id: ${postId} UserId: ${userId}`,
      })
    }

    logger.info(
      `🔍 Tentative de unlike du post par un utilisateur: ID ${postId} User ${userId}`
    )
    const post = await Post.findOne({ _id: postId }).populate("user")
    if (!post) {
      logger.error("❌ Erreur lors de la récupération du post")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du post Post: ${postId} UserId: ${userId}`,
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      logger.error("❌ Erreur lors de la récupération de l'utilisateur")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du post Post: ${postId} UserId: ${userId}`,
      })
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
    res.status(200).json({ message: "Post liké avec succès !" })

    logger.info(`✅ Post liké avec succès : ID ${postId}`)
  } catch (error) {
    logger.error(`❌ Erreur lors du unlike du post : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

exports.savePost = async (req, res) => {
  logger.info(`🔍 Tentative de sauvegarde du post : ID ${req.params.id}`)
  await saveOrUnsavePost(req, res, "$addToSet")
}

exports.unsavePost = async (req, res) => {
  logger.info(
    `🔍 Tentative de retrait de la sauvegarde du post : ID ${req.params.id}`
  )
  await saveOrUnsavePost(req, res, "$pull")
}

/**
 * Sauvegarde ou retire la sauvegarde d'un post pour un utilisateur donné en mettant à jour
 * le tableau `savedPosts` de l'utilisateur dans la base de données. Utilise l'opération `$addToSet`
 * ou `$pull` en fonction de la valeur du paramètre `operation`.
 *
 * @param req - L'objet de la requête.
 * @param res - L'objet de la réponse.
 * @param {string} operation - L'opération à effectuer, soit "$addToSet" pour sauvegarder le post, soit "$pull" pour retirer la sauvegarde.
 */
const saveOrUnsavePost = async (req, res, operation) => {
  try {
    const id = req.params.id
    userId = req.userId

    logger.info(
      `🔍 Tentative de ${
        operation === "$addToSet" ? "sauvegarde" : "retrait"
      } du post : ID ${id} pour l'utilisateur : ID ${userId}`
    )

    const update = {}
    update[operation === "$addToSet" ? "$addToSet" : "$pull"] = {
      savedPosts: id,
    }

    const updatedUserPost = await User.findOneAndUpdate(
      { _id: userId },
      update,
      { new: true }
    )
      .select("savedPosts")
      .populate({
        path: "savedPosts",
        populate: {
          path: "community",
          select: "name",
        },
      })

    if (!updatedUserPost) {
      logger.warn(`⚠️ Utilisateur introuvable : ID ${userId}`)
      return res.status(404).json({
        message: "Utilisateur introuvable",
      })
    }

    logger.info(
      `✅ ${
        operation === "$addToSet" ? "Post sauvegardé" : "Post retiré"
      } avec succès pour l'utilisateur : ID ${userId}`
    )

    const formattedPosts = updatedUserPost.savedPosts.map((post) => ({
      ...post.toObject(),
      createdAt: dayjs(post.createdAt).fromNow(),
    }))

    logger.debug(
      `📄 Liste des posts sauvegardés mise à jour pour l'utilisateur : ID ${userId}`
    )

    res.status(200).json(formattedPosts)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la ${
        operation === "$addToSet" ? "sauvegarde" : "retrait"
      } du post : ${error.message}`
    )
    res.status(500).json({
      message: "Erreur serveur",
    })
  }
}
