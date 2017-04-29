const express = require('express');
const router = express.Router();
const rentableController = require('../controllers/rentable.controller');
const passport = require('../../config/passport');

router.post('/', passport.authenticate, passport.hasOwnerAccess, rentableController.createRentable);

router.get('/', rentableController.getAllRentables);

router.get('/apartments', rentableController.getAllApartments);

router.get('/rooms', rentableController.getAllRooms);

router.get('/ownerViews', rentableController.getReviewRating);

router.get('/ownerRentables', passport.authenticate, passport.hasOwnerAccess, rentableController.getOwnerRentables);

router.get('/ownerApartments', passport.authenticate, passport.hasOwnerAccess, rentableController.getOwnerApartments);

router.get('/ownerRooms', rentableController.getOwnerRooms);

router.get('/unverifiedRooms', passport.authenticate, passport.hasAdminAccess, rentableController.getUnverifiedRooms);

router.get('/unverifiedApartments', passport.authenticate, passport.hasAdminAccess, rentableController.getUnverifiedApartments);

// router.get('/reviews-ratings/:id', rentableController.getRentableReviewsAndRatings);

router.get('/filter', rentableController.getFilteredRentables);

router.get('/search', rentableController.getSearchResults);

router.put('/verifyAd/:id', passport.authenticate, passport.hasAdminAccess, rentableController.verifyAd);

router.get('/:id', rentableController.getRentableById);

// router.put('/rate/:id', rentableController.insertRating);
//
// router.put('/review/:id/', rentableController.insertReview);

router.put('/:id', passport.authenticate, passport.hasOwnerAccess, rentableController.updateRentable);

router.delete('/:id', passport.authenticate, passport.hasOwnerAccess, rentableController.deleteRentable);

module.exports = router;

// other methods
