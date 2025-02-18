const Comment = require("../models/Comment.model")
const Post = require("../models/post.model")
const mongoose = require("mongoose")
const User = require("../models/user.model")
const logger = require("../utils/logger") // Import du logger Winston

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
      createdAt: commentData.createdAt,
      comments: commentData.comments,
      content: commentData.content,
      user: user,
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

    if (parentType === "comment") {
      const updatedComment = await Comment.updateOne(
        { _id: parentId },
        { $push: { comments: _id } }
      )
      logger.info(
        `🔗 Commentaire enfant lié à un autre commentaire (Parent ID : ${parentId})`
      )
    } else if (parentType === "post") {
      const updatedPost = await Post.updateOne(
        { _id: parentId },
        { $push: { comments: _id } }
      )
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
