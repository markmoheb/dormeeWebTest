const Model = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const passport = require('passport');

// Authenticate the user and get a JWT
module.exports.loginJWT = (req, res) => {
    req.checkBody('email', 'Email required').notEmpty();
    // req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'password required').notEmpty();

    let errors = req.validationErrors();

    if (errors) res.json({message: 'Error: ' + errors[0].msg});
    else {
        let input = req.body.email;
        Model.getUserByUsernameOrEmail(input, function(err, user) {
            if (err)
                throw err;

            if (!user)
                res.json({success: false, message: 'Authentication failed. User not found.'});

            else {
                // Check if password matches.
                let candidatePassword = req.body.password;
                let originalPassword = user.password;
                Model.comparePassword(candidatePassword, originalPassword, function(err, isMatch) {
                    if (isMatch && !err) { // Create token if the password matched and no error was thrown
                        let userId = {'id': user._id};
                        let token = jwt.sign(userId, config.secret, {expiresIn: config.ttl});
                        res.json({success: true, JWT: token});
                    } else
                        res.status(400).json({success: false, message: 'Authentication failed. Passwords did not match.'});
                });
            }
        });
    }
};

// Create
module.exports.registerUser = (req, res) => {
    // check that all required parameters are present
    req.checkBody('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();
    req.checkBody('first_name', 'first_name required').notEmpty();
    req.checkBody('phone_number', 'phone_number required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();

    let errors = req.validationErrors();
    if (errors)
        res.status(400).json({error: errors[0].msg});

    else {
        // create the new user
        let newUser = new Model(req.body);
        newUser.role = 'user';

        Model.createUser(newUser, (err, newUser) => {
            if (err) {
                res.status(400).json({error: Object.keys(err.errors) + ' is not unique'});
            } else
                res.status(200).json(newUser.username + ' was created');
        });
    }
};

module.exports.getUserRole = function(req, res, next) {
    passport.authenticate('jwt', function(err, user, info) {
        if (err) {
            return res.status(400).json({
                error: err.message,
            });
        }
        if (!user) {
            return res.status(200).json({
                role: 'visitor',
            });
        }

        req.user = user;
        return res.status(200).json({
            role: user.role,
        });
    })(req, res, next);
};
