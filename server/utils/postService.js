const Post = require("../models/post.model")

/**
 * Récupère les posts avec des options de filtrage, tri, pagination et population.
 *
 * @param {Object} filter - Filtre pour la requête MongoDB.
 * @param {Object} options - Options pour la récupération des posts.
 * @param {number} options.limit - Nombre maximum de posts à récupérer.
 * @param {number} options.skip - Nombre de posts à ignorer (pagination).
 * @param {Object} options.sort - Critères de tri.
 * @param {Array<string>} options.populate - Champs à peupler.
 * @param {Array<string>} savedPosts - Liste des IDs des posts sauvegardés par l'utilisateur.
 * @returns {Promise<Array>} - Liste des posts récupérés.
 */
const getPosts = async (
  filter,
  {
    limit = 10,
    skip = 0,
    sort = { createdAt: -1 },
    populate = [],
    savedPosts = [],
  }
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

  // Ajouter le paramètre "save" si le post est sauvegardé
  return posts.map((post) => ({
    ...post,
    save: savedPosts.includes(post._id.toString()),
  }))
}

module.exports = { getPosts }
