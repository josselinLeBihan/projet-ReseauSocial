const fs = require("fs");
const logger = require("../../utils/logger");

function avatarUpload(req, res, next) {
  logger.info(`Avatar upload middleware`);

  const multer = require("multer");
  const path = require("path");
  const up_folder = path.join(__dirname, "../../assets/userAvatars");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(up_folder)) {
        fs.mkdirSync(up_folder, { recursive: true });
        logger.info(`Répertoire créé : ${up_folder}`);
      }
      cb(null, up_folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + "-" + uniqueSuffix + ext;
      logger.info(`Nom de fichier généré : ${filename}`);
      cb(null, filename);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      logger.debug(`Fichier reçu : ${file.originalname}`);

      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        logger.info(`Type de fichier accepté : ${file.mimetype}`);
        cb(null, true);
      } else {
        logger.warn(`Type de fichier rejeté : ${file.mimetype}`);
        cb(null, false);
      }
    },
  });

  upload.any()(req, res, (err) => {
    if (err) {
      logger.error(`Erreur lors du téléchargement du fichier : ${err.message}`);
      res.status(500).json({
        success: false,
        message: "Erreur lors du téléchargement du fichier",
        error: err.message,
      });
    } else {
      logger.info("Fichier téléchargé avec succès");
      next();
    }
  });
}

module.exports = avatarUpload;
