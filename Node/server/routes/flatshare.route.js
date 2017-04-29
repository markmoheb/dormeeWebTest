const express = require('express');
const router = express.Router();
const flatshareController = require('../controllers/flatshare.controller');

// CRUD =========================================================================
// Create
router.post('/', flatshareController.createFlatshare);

// Read
router.get('/', flatshareController.getAllFlatshares);
router.get('/:id', flatshareController.getFlatshareById);

// Update
router.put('/:id', flatshareController.updateFlatshare);

// Delete
router.delete('/delete', flatshareController.deleteFlatshare);

// Other Methods ================================================================

module.exports = router;
