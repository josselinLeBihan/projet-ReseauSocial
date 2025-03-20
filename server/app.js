const express = require("express")
const app = express()
const mongoose = require("mongoose")
const userRoutes = require("./routes/user.routes")
const authRoutes = require("./routes/auth.routes")
const communityRoutes = require("./routes/communities.routes")
const postRoutes = require("./routes/post.routes")
const commentRoutes = require("./routes/comment.routes")
const profileRoutes = require("./routes/profile.routes")
const logger = require("./utils/logger")
const decodeToken = require("./middlewares/auth/decodeToken")

const passport = require("passport")

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info("✅ Connexion à MongoDB réussie !"))
    .catch(() => logger.error("❌ Connexion à MongoDB échouée !"))
}

// Middleware pour parser les données JSON
app.use(express.json())

// Middleware pour parser les données encodées en URL
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
require("./config/passport.js")

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  )
  next()
})

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/community", communityRoutes)
app.use("/post", postRoutes)
app.use("/comment", commentRoutes)
app.use("/profile", profileRoutes)

logger.info("Routes chargées avec succès")

app.use((err, req, res, next) => {
  logger.error(`❌ Erreur: ${err.message}`)
  res.status(500).json({ error: "❌ Une erreur interne est survenue." })
})

module.exports = app
