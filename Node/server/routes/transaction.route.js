const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');


router.get('/', transactionController.getMyTransactions);
router.post('/charge', transactionController.saveTransaction);

module.exports = router;
