const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.get('/', authController.getUserRole);

router.post('/login', authController.loginJWT);
router.post('/register', authController.registerUser);

module.exports = router;
