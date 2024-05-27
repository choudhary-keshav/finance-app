import express from 'express';
import { getTransactions } from '../controllers/getTransactionController';
const authenticateToken = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.get('/getTransactions', authenticateToken, getTransactions);

module.exports = router;
