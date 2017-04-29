const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student.controller');

// CRUD =========================================================================
// Create
router.post('/', studentController.createStudent);

// Read
router.get('/', studentController.getAllStudents);
router.get('/count', studentController.getStudentCount);
router.get('/:id', studentController.getStudent);

// Update
router.put('/:id', studentController.updateStudent);

// Delete
router.delete('/:id', studentController.deleteStudent);

// Other Methods ================================================================
router.get('/owner/:owner_id', studentController.getOwnerInfo);

module.exports = router;
