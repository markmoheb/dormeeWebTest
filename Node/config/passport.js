const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/config');

const User = require('../server/models/user.model');
const roles = User.roles;

// Setup work and export for the JWT passport strategy
// Copied from passport-jwt documentation https://github.com/themikenicholson/passport-jwt
// {
module.exports.passportJWT = function() {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwtPayload, done) {
    User.getUserById(jwtPayload.id, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  }));
};
// }

module.exports.authenticate = function(req, res, next) {
  passport.authenticate('jwt', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      if(info)
        return res.status(401).json({success: false, message: info.message});
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports.hasUserAccess = function(req, res, next) {
  const user = req.user;
  if (user.hasAccess(roles.User))
    return next();
  else {
    return res.status(401).json({success: false, message: 'Unauthorized'});
  }
};

module.exports.hasStudentAccess = function(req, res, next) {
  const user = req.user;
  if (user.hasAccess(roles.Student))
    return next();
  else {
    return res.status(401).json({success: false, message: 'Unauthorized'});
  }
};

module.exports.hasOwnerAccess = function(req, res, next) {
  const user = req.user;
  if (user.hasAccess(roles.Owner))
    return next();
  else {
    return res.status(401).json({success: false, message: 'Unauthorized'});
  }
};

module.exports.hasAdminAccess = function(req, res, next) {
  const user = req.user;
  if (user.hasAccess(roles.Admin))
    return next();
  else {
    return res.status(401).json({success: false, message: 'Unauthorized'});
  }
};

// Deprecated
module.exports.decodeJWT = function(req, cb) {
  let authHeader = req.get('Authorization');
  if (authHeader) {
    authHeader = authHeader.split(' ')[1];
    let jwtPayload = jwt.verify(authHeader, config.secret);
    const id = jwtPayload.id;
    cb(id, true);
  } else
    cb(null, false);
};
