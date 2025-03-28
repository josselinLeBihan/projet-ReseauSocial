// filepath: e:\dossier_important\travail\Web\Projets\projet-ReseauSocial\server\config\passport.js
const passport = require("passport")
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt")
const User = require("../models/user.model")

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
}

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done(err, false)
    }
  })
)
