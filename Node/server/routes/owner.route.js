const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const ownerController = require('../controllers/owner.controller');

// CRUD =========================================================================
// Create
router.post('/', ownerController.createOwner);

// Read
router.get('/', ownerController.getAllOwners);
router.get('/count', ownerController.getOwnerCount);
router.get('/:id', ownerController.getOwner);

// Update
router.put('/addPaymentInfo', passport.authenticate, passport.hasOwnerAccess, ownerController.addPayment);
router.put('/:id', ownerController.updateOwner);

// Delete
router.delete('/:id', ownerController.deleteOwner);

// Other Methods ================================================================
// router.put('/addPaymentInfo/:id', ownerController.addPaymentInfo );

module.exports = router;
