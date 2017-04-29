const Model = require('../models/user.model');

const passportConfig = require('../../config/passport');
const multerConfig = require('../../config/multer');

// CRUD =====================================================================

// Create
module.exports.createUser = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                // check that the user is an admin

                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!user) {
                    res.status(400).json({error: 'user not found'});
                    return;
                }
                if (admin.role === 'admin') {
                    // this is the point when you are sure that the
                    // requesting user is authorized to access this path

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
                            if (err)
                                res.status(400).json({error: err.message});
                            else
                                res.status(200).json(newUser.username + ' was created');
                        });
                    }
                } else
                    res.status(403).json({message: 'Unauthorized Access'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};

// Read
module.exports.getAllUsers = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!admin) {
                    res.status(400).json({error: 'admin not found'});
                    return;
                }
                // check that the user is an admin
                if (admin.role === 'admin') {
                    // this is the point when you are sure that the
                    // requesting user is authorized to access this path

                    Model.getAllUsers('user', (err, users) => {
                        if (err)
                            res.status(400).json({error: err.message});
                        else
                            res.status(200).json(users);
                    });
                } else
                    res.status(403).json({message: 'Unauthorized Access'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};

module.exports.getUser = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!admin) {
                    res.status(400).json({error: 'admin not found'});
                    return;
                }
                // check that the user is an admin
                if (admin.role === 'admin') {
                    // aquire the userId from the path
                    let userId = req.params.id;
                    // make sure the id is valid
                    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                        // get the user associated with the pathId
                        Model.getUserById(userId, (err, user) => {
                            if (!user) {
                                res.status(400).json({error: 'user not found'});
                                return;
                            }
                            if (err)
                                res.status(400).json({error: err.message});
                            else {
                                // if the aquired object is not a user, abort
                                if (user.role == !'user')
                                    res.status(400).json({error: 'Invlid Request'});
                                else
                                    res.status(200).json(user);
                            }
                        });
                    } else
                        res.status(403).json({message: 'Unauthorized Access'});
                } else
                    res.status(400).json({error: 'Invalid Id'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};

module.exports.getUserCount = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                // check that the user is an admin
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!user) {
                    res.status(400).json({error: 'user not found'});
                    return;
                }
                if (admin.role === 'admin') {
                    Model.countUsers('user', (err, count) => {
                        if (err)
                            res.status(400).json({error: err.message});
                        else
                            res.status(200).json({count: count});
                    });
                } else
                    res.status(403).json({message: 'Unauthorized Access'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};


// Update
module.exports.updateUser = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                // check that the user is an admin
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!admin) {
                    res.status(400).json({error: 'user not found'});
                    return;
                }
                if (admin.role === 'admin') {
                    // aquire the userId from the path
                    let userId = req.params.id;
                    // make sure the id is valid
                    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                        // get the user associated with the pathId
                        Model.getUserById(userId, (err, user) => {
                            // if the aquired object is not a user, abort
                            if (err) {
                                res.status(400).json({error: err.message});
                                return;
                            }
                            if (!user) {
                                res.status(400).json({error: 'user not found'});
                                return;
                            }
                            if (user.role == !'user')
                                res.status(400).json({error: 'Invlid Request'});
                            else {
                                let update = {$set: req.body};
                                update.$set.role = 'user';

                                // a flag to indicate if the password needs reEncrypting
                                let isPasswordUpdated = req.body.password;
                                Model.updateUser(isPasswordUpdated, user._id, update, (err) => {
                                    if (err)
                                        res.status(400).json({error: err.message});
                                    else
                                        res.status(200).json({message: user.username + ' was updated'});
                                });
                            }
                        });
                    } else
                        res.status(403).json({message: 'Unauthorized Access'});
                } else
                    res.status(400).json({error: 'Invalid Id'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};

// Delete
module.exports.deleteUser = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, admin) => {
                // check that the user is an admin
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!admin) {
                    res.status(400).json({error: 'user not found'});
                    return;
                }

                if (admin.role === 'admin') {
                    // aquire the userId from the path
                    let userId = req.params.id;
                    // make sure the id is valid
                    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                        // get the user associated with the pathId
                        Model.getUserById(userId, (err, user) => {
                            // if the aquired object is not a user, abort
                            if (err) {
                                res.status(400).json({error: err.message});
                                return;
                            }
                            if (!user) {
                                res.status(400).json({error: 'user not found'});
                                return;
                            }
                            if (user.role == !'user')
                                res.status(400).json({error: 'Invlid Request'});
                            else {
                                Model.deleteUser(user, (err) => {
                                    if (err)
                                        res.status(400).json({error: err.message});
                                    else
                                        res.status(200).json({message: user.username + ' was deleted'});
                                });
                            }
                        });
                    } else
                        res.status(403).json({message: 'Unauthorized Access'});
                } else
                    res.status(400).json({error: 'Invalid Id'});
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};

// Other Methods ===============================================================

module.exports.updateUserFavourites = (req, res) => {
    passportConfig.decodeJWT(req, (id) => {
        let favourites = req.body.favourites;

        if (!favourites._id || !favourites._id.match(/^[0-9a-fA-F]{24}$/))
            res.json({
                message: 'Error: Invalid rantable',
            });
        else {
            Model.updateFavourites(id, favourites, (err, user) => {
                if (err) res.send(err);

                if (user.role == !'user') res.json({
                    message: 'not an user',
                });

                res.json({
                    message: 'User updated!',
                });
            });
        }
    });
};

module.exports.updateProfile = (req, res) => {
    const user = req.user;

    let update = {$set: req.body};
    update.$set.role = 'user';

    // isPasswordUpdated is just a flag to indicate if the password needs reEncrypting
    let isPasswordUpdated = req.body.password;
    Model.updateUser(isPasswordUpdated, user._id, update, (err) => {
        if (err)
            res.status(400).json({error: err.message});
        else
            res.status(200).json({message: user.username + ' was updated'});
    });
};

module.exports.verifyUser = (req, res) => {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).json({error: 'Invalid Id'});

    Model.getUserById(userId, (err, user) => {
        // if the aquired object is not a user, abort
        if (user.role == !'user')
            return res.status(400).json({error: 'Invlid Request'});

        user.role = user.verifyPending;
        user.verifyPending = null;

        Model.updateUserByObject(null, user, (err) => {
            if (err)
                return res.status(400).json({error: err.message});
            return res.status(200).json({message: user.username + ' was approved'});
        });
    });
};

module.exports.rejectUser = (req, res) => {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).json({error: 'Invalid Id'});

    Model.getUserById(userId, (err, user) => {
        // if the aquired object is not a user, abort
        if (user.role == !'user')
            return res.status(400).json({error: 'Invlid Request'});

        user.verifyPending = null;
        user.role = 'user';

        Model.updateUserByObject(null, user, (err) => {
            if (err)
                return res.status(400).json({error: err.message});
            return res.status(200).json({message: user.username + ' was rejected'});
        });
    });
};

let uploadPersonalIds = multerConfig.uploadPersonalIds;
module.exports.verifyRequestOwner = (req, res) => {
    let user = req.user;
    uploadPersonalIds(req, res, (err) => {
        if (err)
            return res.status(400).json({error: err.message});
        if (!req.file)
            return res.status(400).json({error: 'please upload your personal id'});

        if (user.role == !'user')
            return res.status(400).json({error: 'not an user'});

        user.verifyPending = 'owner';
        user.personal_id = 'public/uploads/personal ids/' + req.file.filename;
        user.university_id = req.body.university_id;

        Model.updateUserByObject(null, user, (err) => {
            if (err)
                return res.status(400).json({error: err.message});
            return res.status(200).json({message: 'university id uploaded'});
        });
    });
};

let uploadUniversityIds = multerConfig.uploadUniversityIds;
module.exports.verifyRequestStudent = (req, res) => {
    let user = req.user;
    uploadUniversityIds(req, res, (err) => {
        if (err)
            return res.status(400).json({error: err.message});
        if (!req.file)
            return res.status(400).json({error: 'please upload your personal id'});

        req.checkBody('university', 'University Name required').notEmpty();
        req.checkBody('universityEmail', 'University Email required').notEmpty();
        req.checkBody('universityEmail', 'Email is not valid').isEmail();

        const errors = req.validationErrors();

        if (errors)
            return res.status(400).json({error: errors[0].msg});

        if (user.role == !'user')
            return res.status(400).json({error: 'not an user'});

        user.verifyPending = 'student';
        user.personal_id = 'public/uploads/personal ids/' + req.file.filename;
        user.university_id = req.body.university_id;

        Model.updateUserByObject(null, user, (err) => {
            if (err)
                return res.status(400).json({error: err.message});
            return res.status(200).json({message: 'university id uploaded'});
        });
    });
};

// Getting user for handling profile features
module.exports.getUserProfile = (req, res) => {
    const id = req.user._id;
    Model.getUserById(id, (err, user) => {
        if (err)
            return res.status(400).json({message: err.message});
        return res.status(200).json(user);
    });
};

module.exports.getVerificationRequests = function(req, res) {
    Model.getVerificationRequests((err, users) => {
        if (err) return res.status(400).json({error: err.message});
        return res.status(200).json(users);
    });
};
