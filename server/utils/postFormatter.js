const dayjs = require("dayjs")

/**
 * Formate un post avec des dates relatives
 * @param {Object} post - Le post à formater
 * @returns {Object} - Le post formaté
 */
const formatPost = (post) => ({
  ...post,
  createdAt: dayjs(post.createdAt).fromNow(),
  modifiedAt: post.modifiedAt && dayjs(post.modifiedAt).fromNow(),
})

module.exports = { formatPost }
