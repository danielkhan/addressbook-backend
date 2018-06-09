const passport = require('passport');
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/UserService');

module.exports = (config) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, cb) => {
    UserService.verifyUser(email, password)
      .then((user) => {
        if (!user) {
          return cb(null, false, { message: 'Incorrect email or password.' });
        }
        const userJson = user.toJSON();
        delete userJson.password;
        return cb(null, userJson, { message: 'Logged In Successfully' });
      })
      .catch(err => cb(err));
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  }, async (jwtPayload, cb) => {
    if (!jwtPayload.userId) {
      return cb('Invalid Data');
    }
    const user = await UserService.findById(jwtPayload.userId);
    return cb(null, user);
  }));
};
