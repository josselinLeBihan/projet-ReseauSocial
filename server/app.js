require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const userRoutes = require("./routes/user.routes")
const authRoutes = require("./routes/auth.routes")
const communityRoutes = require("./routes/communities.routes")
const postRoutes = require("./routes/post.routes")
const commentRoutes = require("./routes/comment.routes")

const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"))

app.use(express.json())

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

module.exports = app
