const Comment = require("../models/Comment.model")
const Post = require("../models/post.model")
const mongoose = require("mongoose")
const User = require("../models/user.model")
const logger = require("../utils/logger")
const dayjs = require("dayjs")
const relativeTime = require("dayjs/plugin/relativeTime")

dayjs.extend(relativeTime)
dayjs.locale("fr")

/**
 * Récupère les données d'un commentaire
 *
 * @Route GET /comment/:id
 */
exports.getComment = async (req, res, next) => {
  try {
    const { id } = req.params
    logger.info(`🔍 Tentative de récupération du commentaire avec l'ID : ${id}`)

    const commentData = await Comment.findOne({ _id: id })
    if (!commentData) {
      logger.warn(`⚠️ Aucun commentaire trouvé avec l'ID : ${id}`)
      return res.status(404).json({ error: "Commentaire non trouvé." })
    }

    const user = await User.findById(commentData.user)
    if (!user) {
      logger.warn(
        `⚠️ Utilisateur associé non trouvé pour le commentaire ID : ${id}`
      )
      return res.status(404).json({ error: "Utilisateur non trouvé." })
    }

    const comment = {
      _id: commentData._id,
      createdAt: dayjs(commentData.createdAt).fromNow(),
      modifiedAt:
        commentData.modifiedAt && dayjs(commentData.modifiedAt).fromNow(),
      comments: commentData.comments,
      content: commentData.content,
      user: {
        _id: user._id,
        name: user.name,
        userName: user.userName,
      },
    }

    logger.info(`✅ Commentaire récupéré avec succès : ID ${id}`)
    res.status(200).json(comment)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la récupération du commentaire (ID : ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Crée un commentaire
 *
 * @Route POST /comment/
 */
exports.addComment = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId()
    const { parentId, parentType, user, content } = req.body

    logger.info("🔧 Tentative de création d'un nouveau commentaire.")

    if (!parentId || !parentType || !user || !content) {
      logger.warn("⚠️ Champs manquants pour la création du commentaire.")
      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

    const comment = new Comment({
      _id,
      user,
      content,
      createdAt: new Date(),
    })

    await comment.save()
    logger.info(
      `✅ Nouveau commentaire créé : ID ${_id}, par l'utilisateur : ${user}`
    )

    const updateQuery = { $push: { comments: { $each: [_id], $position: 0 } } }

    if (parentType === "comment") {
      await Comment.updateOne({ _id: parentId }, updateQuery)
      logger.info(
        `🔗 Commentaire enfant lié à un autre commentaire (Parent ID : ${parentId})`
      )
    } else if (parentType === "post") {
      await Post.updateOne({ _id: parentId }, updateQuery)
      logger.info(
        `🔗 Commentaire enfant lié à un post (Parent ID : ${parentId})`
      )
    } else {
      logger.warn(`⚠️ Type de parent invalide : ${parentType}`)
      return res.status(400).json({ error: "Champs parentType invalide." })
    }

    res.status(201).json({ message: "Comment added!" })
    logger.info(`✅ Commentaire ajouté avec succès : ID ${_id}`)
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la création du commentaire : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Modifie un commentaire
 *
 * @route POST /modify/:id
 */
exports.modifyComment = async (req, res, next) => {
  try {
    const { comment } = req.body
    const { id } = req.params

    const content = comment.content

    logger.info(
      `🔧 Tentative de modification du commentaire : ID ${id} Modification ${content}`
    )

    const modifiedAt = new Date()

    const result = await Comment.updateOne({ _id: id }, { content, modifiedAt })

    if (result.nModified === 0) {
      logger.warn(`⚠️ Aucun changement détecté pour le commentaire : ID ${id}`)
      return res.status(400).json({ message: "Aucune modification appliquée." })
    }

    logger.info(`✅ Commentaire modifié avec succès : ID ${id}`)
    res.status(200).json({ message: "Commentaire modifié !" })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la modification du Commentaire (ID ${req.params.id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Supprime un Commentaire
 *
 * @route POST /delete/:id
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const { parentId, parentType, _id } = req.body

    if (!parentId || !_id) {
      logger.warn("⚠️ Champs manquants pour la suppression du commentaire.")
      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

    logger.info(`🗑️ Tentative de suppression du commentaire : ID ${_id}`)

    if (parentType === "comment") {
      await Comment.updateOne({ _id: parentId }, { $pull: { comments: _id } })
      logger.info(
        `🔗 Suppréssion de la liaison avec le parent. (Parent ID : ${parentId})`
      )
    } else if (parentType === "post") {
      await Post.updateOne({ _id: parentId }, { $pull: { comments: _id } })
      logger.info(
        `🔗 Suppréssion de la liaison avec le parent. (Parent ID : ${parentId})`
      )
    } else {
      logger.warn(`⚠️ Type de parent invalide : ${parentType}`)
      return res.status(400).json({ error: "Champs parentType invalide." })
    }

    const result = await Comment.deleteOne({ _id: _id })

    if (result.deletedCount === 0) {
      logger.warn(`⚠️ Aucun commentaire trouvé pour suppression : ID ${_id}`)
      return res.status(404).json({ message: "Commentaire non trouvé." })
    }

    logger.info(`✅ Commentaire supprimé avec succès : ID ${_id}`)
    res.status(200).json({ message: "Commentaire supprimé !" })
  } catch (error) {
    logger.error(
      `❌ Erreur lors de la suppression du commentaire (ID ${req.params._id}) : ${error.message}`
    )
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Unlike un post
 *
 * @route POST /unlike/:id/:userId
 */
exports.unlikeComment = async (req, res, next) => {
  try {
    const { commentId, userId } = req.params

    if (!commentId || !userId) {
      logger.warn("⚠️ Champs manquants lors du unlike.")
      return res.status(400).json({
        error: `Tous les champs sont requis. Id: ${commentId} UserId: ${userId}`,
      })
    }

    logger.info(
      `🔍 Tentative de unlike du comment par un utilisateur: ID ${commentId} User ${userId}`
    )
    const comment = await Comment.findOne({ _id: commentId }).populate("user")
    if (!comment) {
      logger.error("❌ Erreur lors de la récupération du comment")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du comment Comment: ${commentId} UserId: ${userId}`,
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      logger.error("❌ Erreur lors de la récupération de l'utilisateur")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du comment Comment: ${commentId} UserId: ${userId}`,
      })
    }

    await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } })
    res.status(200).json({ message: "Comment unliké avec succès !" })

    logger.info(`✅ Comment unliké avec succès : ID ${commentId}`)
  } catch (error) {
    logger.error(`❌ Erreur lors du unlike du comment : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Like un comment
 *
 * @route POST /like/:id/:userId
 */
exports.likeComment = async (req, res, next) => {
  try {
    const { commentId, userId } = req.params

    if (!commentId || !userId) {
      logger.warn("⚠️ Champs manquants lors de la création du comment.")
      return res.status(400).json({
        error: `Tous les champs sont requis. Id: ${commentId} UserId: ${userId}`,
      })
    }

    logger.info(
      `🔍 Tentative de like du comment par un utilisateur: ID ${commentId} User ${userId}`
    )
    const comment = await Comment.findOne({ _id: commentId }).populate("user")
    if (!comment) {
      logger.error("❌ Erreur lors de la récupération du comment")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du comment Comment: ${commentId} UserId: ${userId}`,
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      logger.error("❌ Erreur lors de la récupération de l'utilisateur")
      return res.status(400).json({
        error: `Erreur lors de la réccupération du comment Comment: ${commentId} UserId: ${userId}`,
      })
    }

    await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } })
    res.status(200).json({ message: "Comment liké avec succès !" })

    logger.info(`✅ Comment liké avec succès : ID ${commentId}`)
  } catch (error) {
    logger.error(`❌ Erreur lors du like du comment : ${error.message}`)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}
