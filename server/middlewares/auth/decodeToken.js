const jwt = require("jsonwebtoken")

const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, process.env.SECRET)
      req.userId = decoded.id
      next()
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" })
    }
  } else {
    return res.status(401).json({ message: "No token provided" })
  }
}

module.exports = decodeToken
