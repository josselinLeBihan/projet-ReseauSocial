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
const Database = require("./config/database")

const passport = require("passport")

const PORT = process.env.PORT || 3000

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

db.connect().catch((err) =>
  logger.error("❌ Connexion à MongoDB échouée !", err)
)

const cors = require("cors")
const morgan = require("morgan")

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders:
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  })
)
app.use(morgan("dev"))
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"))
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
)

// Middleware pour parser les données JSON avec une limite de taille augmentée
app.use(express.json({ limit: "50mb" }))

// Middleware pour parser les données encodées en URL avec une limite de taille augmentée
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use(passport.initialize())
require("./config/passport.js")

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" })
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
