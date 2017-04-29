const Model = require('../models/user.model');
const passportConfig = require('../../config/passport');

// CRUD =====================================================================

// Create
module.exports.createAdmin = (req, res) => {
    let newAdmin = new Model(req.body);
    newAdmin.role = 'admin';

    Model.createUser(newAdmin, (err, newAdmin) => {
        if (err)
            res.status(400).json({error: err.msg});
        else
            res.json(newAdmin);
    });
};

// Read
module.exports.getAllAdmins = (req, res) => {
    Model.getAllUsers('admin', (err, admins) => {
        if (err)
            res.send(err.message);
        else
            res.json(admins);
    });
};

module.exports.getAdmin = (req, res) => {
    let id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Model.getUserById(id, (err, admin) => {
            if (err)
                res.send(err.message);
            else {
                if (admin.role === 'admin') res.json(admin);
                else res.json({message: 'not an admin'});
            }
        });
    } else res.json({message: 'invalid id'});
};

module.exports.getAdminCount = (req, res) => {
    Model.countUsers('admin', (err, count) => {
        if (err)
            res.send(err.message);
        else
            res.json(count);
    });
};

// Update
module.exports.updateAdmin = (req, res) => {
    Model.getUserById(req.params.id, (err, admin) => {
        if (err) res.send(err);

        if (admin.role == ! 'admin') res.json({message: 'not an admin'});

        let update = {$set: req.body};
        update.$set.role = 'admin';

        // isPasswordUpdated is just a flag to indicate if the password needs reEncrypting
        let isPasswordUpdated = req.body.password;
        Model.updateUser(isPasswordUpdated, admin._id, update, (err) => {
            if (err) res.send(err);
            res.json({message: 'Admin updated!'});
        });
    });
};

// Delete
module.exports.deleteAdmin = (req, res) => {
    let id = req.params.id;
    Model.getUserById(id, (err, admin) => {
        if (err) res.send(err);

        if (admin.role == ! 'admin') res.json({message: 'not an admin'});

        Model.deleteUser(admin, (err, admin) => {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted'});
        });
    });
};


module.exports.blockUser = function(req, res) {
    passportConfig.decodeJWT(req, (id1) => {
        let email = req.body.email;
        let query = {email: email};
        let blockedUser = req.body.blocked_user;
        let update = {$set: {blocked_user: blockedUser}};
        Model.getUserById(id1, function(err, user) {
            if (user.role === 'admin') {
                Model.blockUser(query, update, function(err, results) {
                    if (err)
                        displayError(err, results);
                    else
                        res.json(results);
                });
            } else {
                res.send('unauthorized access, you are not an admin');
            }
        });
    });
};
