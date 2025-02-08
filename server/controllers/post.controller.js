const Post = require("../models/post.model")
const mongoose = require("mongoose")

/**
 * Crée un post
 *
 * @route post/
 */
exports.createPost = async (req, res, next) => {
  try {
    const { content, user, fileUrl, fileType, community } = req.body

    if (!content || !user) {
      console.error("⚠️ Champs manquants !")
      return res.status(400).json({ error: "Tous les champs sont requis." })
    }

    //TODO : verifier si l'utilisateur existe

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
    res.status(201).json({ message: "Post créé !" })
  } catch (error) {
    console.error("Erreur lors de la création du post :", error)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Réccupère les posts d'une communauté
 *
 * * @route POST /community/:communityId
 */
exports.getPosts = async (req, res, next) => {
  try {
    const { communityId } = req.params

    const posts = await Post.find({ community: communityId }).sort({
      createAt: -1,
    })

    res.status(200).json(posts)
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Modifie un post
 *
 * * @route POST /modify/:id
 */
exports.modifyPost = async (req, res, next) => {
  try {
    const { content, fileUrl, fileType } = req.body
    const { id } = req.params
    Post.updateOne({ _id: id }, { content, fileUrl, fileType })
    res.status(200).json({ message: "Post modifié !" })
  } catch (error) {
    console.error("Erreur lors de la modification du post :", error)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Supprime un post
 *
 * * @route POST /delete/:id
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params
    await Post.deleteOne({ _id: id })
    res.status(200).json({ message: "Post supprimé !" })
  } catch (error) {
    console.error("Erreur lors de la suppréssion du post :", error)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}

/**
 * Réccupère un post
 *
 * * @route POST /:id
 */
exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await Post.findOne({ _id: id })
    res.status(200).json(post)
  } catch (error) {
    console.error("Erreur lors de la récupération du post :", error)
    res.status(500).json({ error: "Une erreur est survenue." })
  }
}
