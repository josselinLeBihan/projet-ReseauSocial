const Post = require("../models/post.model")
const User = require("../models/user.model")
const logger = require("../utils/logger")

/**
 * Récupère les posts avec des options de filtrage, tri, pagination et population.
 *
 * @param {Object} filter - Filtre pour la requête MongoDB.
 * @param {string} userId - ID de l'utilisateur pour vérifier les posts sauvegardés.
 * @param {Object} options - Options pour la récupération des posts.
 * @param {number} options.limit - Nombre maximum de posts à récupérer.
 * @param {number} options.skip - Nombre de posts à ignorer (pagination).
 * @param {Object} options.sort - Critères de tri.
 * @param {Array<string>} options.populate - Champs à peupler.
 * @returns {Promise<Array>} - Liste des posts récupérés.
 */
const getPosts = async (
  userId,
  filter,
  { limit = 10, skip = 0, sort = { createdAt: -1 }, populate = [] }
) => {
  let query = Post.find(filter)
    .sort(sort)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean()

  // Appliquer les champs à peupler
  populate.forEach((field) => {
    query = query.populate(field)
  })

  const posts = await query

  // Vérifier si l'utilisateur existe
  const user = await User.findById(userId).lean()
  if (!user) {
    throw new Error("Utilisateur introuvable")
  }
  const savedPosts = user.savedPosts || []

  return posts.map((post) => ({
    ...post,
    saved: savedPosts.some((id) => id.toString() === post._id.toString()),
  }))
}

module.exports = { getPosts }
