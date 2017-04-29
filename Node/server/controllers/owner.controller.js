const Model = require('../models/user.model');
const passportConfig = require('../../config/passport');

// CRUD =====================================================================

// Create
module.exports.createOwner = (req, res) => {
    req.checkBody('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();
    req.checkBody('first_name', 'first_name required').notEmpty();
    req.checkBody('phone_number', 'phone_number required').notEmpty();
    req.checkBody('birthdate', 'birthdate required').notEmpty();
    req.checkBody('personal_id', 'personal ID photo required').notEmpty();
    req.checkBody('selfie', 'selfie photo required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();

    let errors = req.validationErrors();

    if (errors) res.json({message: 'Error: ' + errors[0].msg});
    else {
        let newOwner = new Model(req.body);
        newOwner.role = 'owner';

        Model.createUser(newOwner, (err, newOwner) => {
            if (err)
                res.status(400).json({error: err.msg});
            else
                res.json(newOwner);
        });
    }
};

// Read
module.exports.getAllOwners = (req, res) => {
    Model.getAllUsers('owner', (err, owners) => {
        if (err)
            res.send(err.message);
        else
            res.json(owners);
    });
};

module.exports.getOwner = (req, res) => {
    let id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Model.getUserById(id, (err, owner) => {
            if (err)
                res.send(err.message);
            else {
                if (owner.role === 'owner') res.json(owner);
                else res.json({message: 'not an owner'});
            }
        });
    } else res.json({message: 'invalid id'});
};

module.exports.getOwnerCount = (req, res) => {
    Model.countUsers('owner', (err, count) => {
        if (err)
            res.send(err.message);
        else
            res.json(count);
    });
};

// Update
module.exports.updateOwner = (req, res) => {
    Model.getUserById(req.params.id, (err, owner) => {
        if (err) res.send(err);

        if (owner.role == ! 'owner') res.json({message: 'not an owner'});

        let update = {$set: req.body};
        update.$set.role = 'owner';

        // a flag to indicate if the password needs reEncrypting
        let isPasswordUpdated = req.body.password;
        Model.updateUser(isPasswordUpdated, owner._id, update, (err) => {
            if (err) res.send(err);
            res.json({message: 'Owner updated!'});
        });
    });
};

// Delete
module.exports.deleteOwner = (req, res) => {
    let id = req.params.id;
    Model.getUserById(id, (err, owner) => {
        if (err) res.send(err);

        if (owner.role == ! 'owner') res.json({message: 'not an owner'});

        Model.deleteUser(owner, (err, owner) => {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted'});
        });
    });
};

// Other Methods ===============================================================
module.exports.addPaymentInfo = (req, res) => {
    req.checkBody('account', 'Account required').notEmpty();
    req.checkBody('bank', 'Bank required').notEmpty();

    let errors = req.validationErrors();

    if (errors) res.json({message: 'Error: ' + errors[0].msg});
    else {
        let id = req.params.id;
        Model.getUserById(id, (err, owner) => {
            if (err) res.send(err);
            if (!owner) res.send('no such owner listed.');
            if (owner.role == ! 'owner') res.json({message: 'not an owner'});

            let paymentInfo = {
                account: req.body.account,
                bank: req.body.bank,
            };

            let update = {$set: {'payment_info': paymentInfo}};

            // a flag to indicate if the password needs reEncrypting
            let isPasswordUpdated = false;
            Model.updateUser(isPasswordUpdated, owner._id, update, (err) => {
                if (err) res.send(err);
                res.json({message: 'Add payment info'});
            });
        });
    }
};

module.exports.addPayment = (req, res) => {
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            Model.getUserById(id, (err, user) => {
                // check that the user is an admin
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!user) {
                    res.status(400).json({error: 'user not found'});
                    return;
                }

                let paymentInfo = req.body;

                let update = {$set: {'payment_info': paymentInfo}};

                Model.updateUser(null, user._id, update, (err) => {
                    if (err)
                        res.status(400).json({error: err.message});
                    else
                        res.status(200).json({message: user.username + ' was updated'});
                });
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};
