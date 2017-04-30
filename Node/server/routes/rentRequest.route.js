const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentRequestController');
const passport = require('../../config/passport');

// CRUD =========================================================================
// Create
router.post('/reserve', rentController.addStudentRequest);

// Read
router.get('/view/:id', rentController.getStudentRequest);
router.get('/viewStatus/:id', rentController.getStudentRequestStatus);
router.get('/viewAll/:id', rentController.getAllStudentRequest);
router.get('/viewRequests/:id', rentController.unacceptedStudentRequest);
router.get('/', rentController.getStudentRequests);
router.get('/check/:id', rentController.checkRedundant);

// Update
router.put('/updateStatus/accept/:id', rentController.acceptRentRequestStatus);
router.put('/updateStatus/reject/:id', rentController.rejectRentRequestStatus);
// Delete
router.delete('/removeRentRequest/:id', rentController.removeRentRequest);

// Other Methods ================================================================
router.post('/updateRequest', rentController.updateStudentRequest);

module.exports = router;
