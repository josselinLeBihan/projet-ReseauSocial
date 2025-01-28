const Post = require('../models/post.model');

/**
 * Crée un post
 * 
 * @route Post /
 */
exports.createPost = async (req, res, next) => {
    const { body, user, fileUrl, fileType, community  } = req.body;

    if (!body || !user) {
        console.error("⚠️ Champs manquants !");
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const post = new Post({
        body,
        user,
        fileUrl,
        fileType
    });

    await post.save();

    res.status(201).json({ message: "Post créé !" });
}