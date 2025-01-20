const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const communityRoutes = require("./routes/communities.routes");

const uri ="mongodb+srv://josselinAdmin:rda1462gr@projet-blog.vlrsp.mongodb.net/?retryWrites=true&w=majority&appName=Projet-blog";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/communities", communityRoutes);

module.exports = app;