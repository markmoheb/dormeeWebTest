const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');

const userController = require('../controllers/user.controller');

// CRUD =========================================================================
// Create
router.post('/', userController.createUser);

// Read
router.get('/', userController.getAllUsers);
router.get('/count', userController.getUserCount);
router.get('/profile', passport.authenticate, passport.hasUserAccess, userController.getUserProfile);
router.get('/verify', passport.authenticate, passport.hasAdminAccess, userController.getVerificationRequests);
router.get('/:id', userController.getUser);

// Update
router.put('/favourites', userController.updateUserFavourites);
router.put('/profile', passport.authenticate, passport.hasUserAccess, userController.updateProfile);
router.put('/:id', userController.updateUser);

// Delete
router.delete('/:id', userController.deleteUser);

// Other Methods ================================================================
router.post('/verify/owner/request/', passport.authenticate, passport.hasUserAccess, userController.verifyRequestOwner);
router.post('/verify/student/request/', passport.authenticate, passport.hasUserAccess, userController.verifyRequestStudent);

router.put('/verify/accept/:id', passport.authenticate, passport.hasAdminAccess, userController.verifyUser);
router.put('/verify/reject/:id', passport.authenticate, passport.hasAdminAccess, userController.rejectUser);

module.exports = router;
