const Model = require('../models/user.model');
const RentModel = require('../models/rentRequest.model');
const passportConfig = require('../../config/passport');

// CRUD =====================================================================

// Create
module.exports.createStudent = (req, res) => {
    req.checkBody('username', 'username required').notEmpty();
    req.checkBody('password', 'password required').notEmpty();
    req.checkBody('first_name', 'first_name required').notEmpty();
    req.checkBody('phone_number', 'phone_number required').notEmpty();
    req.checkBody('universityEmail', 'university_email required').notEmpty();
    req.checkBody('university', 'university required').notEmpty();
    req.checkBody('birthdate', 'birthdate required').notEmpty();
    req.checkBody('personal_id', 'personal ID photo required').notEmpty();
    req.checkBody('selfie', 'selfie photo required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();

    let errors = req.validationErrors();

    if (errors)
        res.status(400).json({error: errors[0].msg});
    else {
        let newStudent = new Model(req.body);
        newStudent.role = 'student';

        Model.createUser(newStudent, (err, newStudent) => {
            if (err)
                res.status(400).json({error: err.msg});
            else
                res.json(newStudent);
        });
    }
};

// Read
module.exports.getAllStudents = (req, res) => {
    Model.getAllUsers('student', (err, students) => {
        if (err)
            res.send(err.message);
        else
            res.json(students);
    });
};

module.exports.getStudent = (req, res) => {
    let id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Model.getUserById(id, (err, student) => {
            if (err)
                res.send(err.message);
            else {
                if (student.role === 'student') res.json(student);
                else res.json({message: 'not an student'});
            }
        });
    } else res.json({message: 'invalid id'});
};

module.exports.getStudentCount = (req, res) => {
    Model.countUsers('student', (err, count) => {
        if (err)
            res.send(err.message);
        else
            res.json(count);
    });
};

// Update
module.exports.updateStudent = (req, res) => {
    Model.getUserById(req.params.id, (err, student) => {
        if (err) res.send(err);

        if (student.role == ! 'student') res.json({message: 'not an student'});

        let update = {$set: req.body};
        update.$set.role = 'student';

        // a flag to indicate if the password needs reEncrypting
        let isPasswordUpdated = req.body.password;
        Model.updateUser(isPasswordUpdated, student._id, update, (err) => {
            if (err) res.send(err);
            res.json({message: 'Student updated!'});
        });
    });
};

// Delete
module.exports.deleteStudent = (req, res) => {
    let id = req.params.id;
    Model.getUserById(id, (err, student) => {
        if (err) res.send(err);

        if (student.role == ! 'student') res.json({message: 'not an student'});

        Model.deleteUser(student, (err, student) => {
            if (err) res.send(err);
            res.json({message: 'Successfully deleted'});
        });
    });
};

// Other =======================================================================

module.exports.getOwnerInfo = (req, res) => {
    let status = 'Accepted';
    // get the id from the jwt
    passportConfig.decodeJWT(req, (id, hasJWT) => {
        // check that the JWT is not empty
        if (hasJWT) {
            // get the user associated with the id
            let id = id;
            Model.getUserById(id, (err, student) => {
                if (err) {
                    res.status(400).json({error: err.message});
                    return;
                }
                if (!student) {
                    res.status(400).json({error: 'student not found'});
                    return;
                }

                // aquire the userId from the path
                let ownerId = req.params.ownerId;
                // make sure the id is valid
                if (ownerId.match(/^[0-9a-fA-F]{24}$/)) {
                    RentModel.checkStatus(id, ownerId, status, function(err, rentRequest) {
                        if (err)
                            res.send(err.message);
                        else {
                            if (rentRequest != null) {
                                Model.getUserById(ownerId, function(err, owner) {
                                    if (err)
                                        res.send(err.message);
                                    else {
                                        if (owner != null)
                                            res.json({message: 'the email of the owners is ' + owner.email + ', the phone number of the owners is ' + owner.phone_number});
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } else
            res.status(403).json({message: 'Unauthorized Access'});
    });
};
