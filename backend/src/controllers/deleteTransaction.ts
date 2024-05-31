import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';

export const deleteTransaction = async (req: Request, res: Response) => {
  console.log('i am delete backennd');
  const { userId, transactionId } = req.params;
  console.log(userId, transactionId);
  try {
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { transactions: { _id: transactionId } } },
      { new: true },
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    // res.status(200).send('Data deleted successfully');
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
