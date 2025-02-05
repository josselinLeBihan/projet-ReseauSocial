const Comment = require("../models/Comment.model");
const Post = require("../models/post.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");

/**
 * Réccupère les données d'un commentaire
 *
 * @Route GET /comment/:id
 */
exports.getComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentData = await Comment.findOne({ _id: id });
    const user = await User.findById(commentData.user)

    const comment = {
      _id: commentData._id,
      createdAt: commentData.createdAt,
      comments: commentData.comments,
      content: commentData.content,
      user: user
    }



    res.status(200).json(comment);
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};


/**
 * Créée un commentaire
 *
 * @Route POST /comment/
 */
exports.addComment = async (req, res, next) => {
  try {

    const _id = new mongoose.Types.ObjectId();
    
    const { parentId, parentType, user, content } = req.body;

    if (!parentId || !parentType || !user || !content) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const comment = new Comment({
      _id,
      user,
      content,
      createdAt: new Date(),
    });

    await comment.save(); // Attendre que l'enregistrement soit terminé


    if (parentType === "comment") {
      await Comment.updateOne({ _id: parentId }, { $push: { comments: _id } });

    } else if (parentType === "post") {
      await Post.updateOne({ _id: parentId }, { $push: { comments: _id } });
    } else {
      return res.status(400).json({ error: "Champs parentType invalide." });
    }

    res.status(201).json({ message: "Comment added!" });

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};

