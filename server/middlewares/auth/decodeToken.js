const jwt = require("jsonwebtoken")
const logger = require("../../utils/logger")

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, process.env.SECRET)
      req.userId = decoded.id
      next()
    } catch (err) {
      console.error("Token verification failed:", err.message)
      return res.status(401).json({ message: "Unauthorized" })
    }
  } else {
    console.warn("No token provided")
    return res.status(401).json({ message: "No token provided" })
  }
}

module.exports = decodeToken
