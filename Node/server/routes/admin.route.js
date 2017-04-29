const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// CRUD =========================================================================
// Create
router.post('/', adminController.createAdmin);

// Read
router.get('/', adminController.getAllAdmins);
router.get('/count', adminController.getAdminCount);
router.get('/:id', adminController.getAdmin);

// Update
router.put('/:id', adminController.updateAdmin);

// Delete
router.delete('/:id', adminController.deleteAdmin);

// Other Methods ================================================================
router.delete('/blockuser', adminController.blockUser);

module.exports = router;
