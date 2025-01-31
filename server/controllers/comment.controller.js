const Comment = require("../models/Comment.model");

exports.addComment = (req, res, next) => {};

/**
 * Réccupère les données d'un commentaire
 *
 * @Route GET /comment/:id
 */
exports.getComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ _id: id });
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
  const _id = require("mongoose").Types.ObjectId();
  const parentID = req.body.parentID;
  const parentType = req.body.parentType;

  if (!parentID && !parentType && !userName && !content) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const comment = new Comment({
    _id: _id,
    user: req.body.user,
    content: req.body.content,
    createdAt: req.body.createdAt,
  });

  comment.save().catch((error) => res.status(400).json({ error }));

  switch (parentType) {
    case "comment":
      Comment.updateOne({ _id: parentID }, { $push: { comments: _id } })
        .then(() => res.status(201).json({ message: "Comment added!" }))
        .catch((error) => res.status(400).json({ error }));
    case "post":
      Post.updateOne({ _id: parentID }, { $push: { comments: _id } })
        .then(() => res.status(201).json({ message: "Comment added!" }))
        .catch((error) => res.status(400).json({ error }));
    default:
  }
};
