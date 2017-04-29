const multer = require('multer');

module.exports.uploadPersonalIds = multer({
    dest: 'public/uploads/personal ids/',
    limits: {fileSize: 5e+6},
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
}).single('img');

module.exports.uploadUniversityIds = multer({
    dest: 'public/uploads/university ids/',
    limits: {fileSize: 5e+6},
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
}).single('img');

module.exports.uploadRentablePhoto = multer({
    dest: 'public/uploads/rentables/',
    limits: {fileSize: 5e+6},
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
}).single('photo');
