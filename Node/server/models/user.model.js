// Dependencies =================================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema =================================================================
let UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: {
            unique: true,
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    birthdate: {
        type: Date,
    },
    gender: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
    },
    university_email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
    },
    university: {
        type: String,
    },
    university_id: {
        type: String,
    },
    payment_info: {
        account: {
            type: String,
        },
        bank: {
            type: String,
        },
    },
    profile_photo: {
        type: String,
    },
    personal_id: {
        type: String,
    },
    selfie: {
        type: String,
    },
    favourites: [{
        rentable: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rentable',
        },
    }],
    verifyPending: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    blocked_user: {
        type: String,
        enum: ['true', 'false'],
    },
});

// Plugins =================================================================
UserSchema.plugin(require('mongoose-unique-validator'));

UserSchema.plugin(require('mongoose-role'), {
    roles: ['user', 'student', 'owner', 'admin'],
    accessLevels: {
        'user': ['user', 'student', 'owner', 'admin'],
        'student': ['student', 'admin'],
        'owner': ['owner', 'admin'],
        'admin': ['admin'],
    },
});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.roles = {
    User: 'user',
    Studemt: 'student',
    Owner: 'owner',
    Admin: 'admin',
};
// CRUD Functions ==============================================================
// Create
module.exports.createUser = (user, callback) => {
    user.created_at = new Date().valueOf();
    user.updated_at = new Date().valueOf();

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            user.save(callback);
        });
    });
};

// Read
module.exports.getAllUsers = (type, callback) => {
    User.find({
        role: type,
    }, callback);
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.countUsers = (type, callback) => {
    User.count({
        role: type,
    }, callback);
};

// Update
module.exports.updateUser = (isPasswordUpdated, id, update, callback) => {
    update.$set.updated_at = new Date().valueOf();

    const query = {'_id': id};
    let newPassword = update.$set.password;

    if (isPasswordUpdated) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPassword, salt, function(err, hash) {
                newPassword = hash;
                User.findOneAndUpdate(query, update, {
                    upsert: false,
                }, callback);
            });
        });
    } else
        User.findOneAndUpdate(query, update, {
            upsert: false,
        }, callback);
};

module.exports.updateUserByObject = (passwordUpdated, user, callback) => {
    user.updated_at = new Date().valueOf();
    let query = {'_id': user._id};
    if (passwordUpdated) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                User.findOneAndUpdate(query, user, {upsert: false}, callback);
            });
        });
    } else
        User.findOneAndUpdate(query, user, {upsert: false}, callback);
};

// Delete
module.exports.deleteUser = (user, callback) => {
    User.remove({
        _id: user._id,
    }, callback);
};

// Other Methods ===============================================================
module.exports.getUserByEmail = (email, callback) => {
    User.findOne({
        email: email,
    }, callback);
};

module.exports.getUserByusername = (username, callback) => {
    User.findOne({
        username: username,
    }, callback);
};

module.exports.getUserByUsernameOrEmail = (input, callback) => {
    User.findOne({$or: [{'username': input}, {'email': input}]}, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.updateFavourites = (userID, newFavourite, callback) => {
    User.findById(userID, (err, user) => {
        if (err) throw err;

        user.updated_at = new Date().valueOf();
        user.favourites.addToSet(newFavourite);

        user.save({
            upsert: false,
        }, callback);
    });
};

module.exports.blockUser = (query, update, callback) => {
    User.findOneAndUpdate(query, update, {upsert: false}, callback);
};

module.exports.getVerificationRequests = (callback) => {
    User.find({
        role: 'user',
        verifyPending: {$exists: true, $ne: null},
    }, callback);
};
