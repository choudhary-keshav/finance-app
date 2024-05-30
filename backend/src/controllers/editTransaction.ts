import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';

export const editTransaction = async (req: Request, res: Response) => {
  console.log('Hello, I am here');
  const { userId, transactionId } = req.params;
  console.log(userId, transactionId)
  const { transactionDate, description, amount, type, balance, category } =
    req.body;

  let debit = '';
  let credit = '';

  console.log(req.body);

  try {
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    if (type === 'debit') {
      debit = amount;
    } else if (type === 'credit') {
      credit = amount;
    }

    const updatedData = {
      'transactions.$.transactionDate': transactionDate,
      'transactions.$.description': description,
      'transactions.$.debit': debit,
      'transactions.$.credit': credit,
      'transactions.$.balance': balance,
      'transactions.$.category': category,
    };

    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { _id: userId, 'transactions._id': transactionId },
      { $set: updatedData },
      { new: true },
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
