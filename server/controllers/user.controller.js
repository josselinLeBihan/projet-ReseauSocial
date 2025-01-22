const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.signup = async (req, res) => {
  try {
    console.log("Données reçues :", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.error("Champs manquants !");
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const hash = await bcrypt.hash(password, 10);
    console.log("Hash généré :", hash);

    const user = new User({
      name,
      email,
      password: hash,
    });

    await user.save();
    console.log("Utilisateur créé :", user);
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte !" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte !" });
    }
    const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });
    res.status(200).json({
      userId: user._id,
      token: token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res.status(500).json({ error });
  }
};