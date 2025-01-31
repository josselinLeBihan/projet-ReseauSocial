const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

const User = require("../models/user.model");

/**
 * Réccupère les informations d'un utilisateur
 *
 * @route GET /:id
 */
exports.getUser = (req, res, next) => {
  console.log(req.params.id);
  User.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((error) => {
      console.error("Database error:", error);
      res.status(400).json({ error });
    });
};
