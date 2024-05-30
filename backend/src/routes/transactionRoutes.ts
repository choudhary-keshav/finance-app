import express from 'express';
import { getTransactions } from '../controllers/getTransactionController';
import { editTransaction } from '../controllers/editTransaction';
const authenticateToken = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.get('/getTransactions', authenticateToken, getTransactions);
router.put('/editTransaction/:userId/:transactionId',editTransaction)

module.exports = router;
