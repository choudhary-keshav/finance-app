import request from 'supertest';
import mongoose from 'mongoose';
const express = require('express');
require('dotenv').config();
const app = express();
import { TransactionModel as Transaction } from '../models/transactionModel';
const jwt = require('jsonwebtoken');

jest.mock('../models/TransactionModel');

describe('GET /api/getTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions for a user with valid token', async () => {
    const token = jwt.sign(
      {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        pic: 'profile.jpg',
      },
      process.env.JWT_SECRET,
    );

    const mockTransactions = [
      {
        _id: '1',
        userId: '123',
        category: 'Food',
        credit: '100',
        debit: '',
        transactionDate: '01-01-2024',
      },
    ];

    (Transaction.aggregate as jest.Mock).mockResolvedValue([
      { transactions: mockTransactions },
    ]);

    const response = await request(app)
      .get('/api/getTransactions')
      .set('Authorization', `Bearer ${token}`);

   // expect(response.status).toBe(200);

    expect(response.body.transactions).toEqual(mockTransactions);
  });
});
