const mongoose = require("mongoose");
const passportJWT = require("passport-jwt");
const config = require("../config");
const LocalStrategy = require("passport-local").Strategy;

const { Strategy: JWTStrategy, ExtractJwt } = passportJWT;

module.exports = passport => {
  const User = mongoose.model("User");
  passport.use(new LocalStrategy(User.authenticate()));
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.SECRET_KEY
      },
      (jwtPayload, cb) =>
        User.findById(jwtPayload.id)
          .then(user => cb(null, user))
          .catch(err => cb(err, null))
    )
  );
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
