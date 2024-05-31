import express from 'express';
import { getTransactions } from '../controllers/getTransactionController';
import { editTransaction } from '../controllers/editTransaction';
import { deleteTransaction } from '../controllers/deleteTransaction';
const authenticateToken = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.get('/getTransactions', authenticateToken, getTransactions);
router.put('/editTransaction/:userId/:transactionId', editTransaction);
router.delete('/deleteTransaction/:userId/:transactionId', deleteTransaction);
module.exports = router;
