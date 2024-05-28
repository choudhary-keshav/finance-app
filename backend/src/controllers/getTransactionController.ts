import { Request, Response } from 'express';
import { TransactionModel as Transaction } from '../models/transactionModel';
import mongoose from 'mongoose';


export const getTransactions = async (req: Request, res: Response) => {
  const {
    category,
    isDebit,
    period,
    customPeriodStart,
    customPeriodEnd,
    page = 1,
    limit = 10,
  } = req.query;
  const user = req.body.user.payload;
  const userId: string = user._id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const pipeline: any[] = [];
  let matchStage: any = { userId: new mongoose.Types.ObjectId(userId) };
  pipeline.push({ $match: matchStage });
  pipeline.push({ $unwind: '$transactions' });
  matchStage = {};

  if (category) {
    matchStage['transactions.category'] = category;
    pipeline.push({ $match: matchStage });
  }

  if (isDebit !== undefined) {
    if (isDebit === 'true') {
      pipeline.push({
        $match: { 'transactions.credit': '' },
      });
    } else {
      pipeline.push({
        $match: { 'transactions.debit': '' },
      });
    }
  }

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  const parseDate = (dateStr: string): Date => {
    const trimmedDateStr = dateStr.trim();
    const [day, month, year] = trimmedDateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  if (period || (customPeriodStart && customPeriodEnd)) {
    const now = new Date();

    switch (period) {
      case 'thisWeek':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customPeriodStart && customPeriodEnd) {
          startDate = parseDate(customPeriodStart as string);
          endDate = parseDate(customPeriodEnd as string);
        } else {
          return res.status(400).json({
            message: 'Custom period start and end dates are required',
          });
        }
        break;
      default:
        startDate = undefined;
        console.log('default case is running');
        break;
    }
    let matchDate: any = {
      $gte: startDate,
    };
    if (customPeriodStart && customPeriodEnd) {
      matchDate.$lte = endDate;
    }
    if (startDate) {
      pipeline.push(
        {
          $addFields: {
            'transactions.dateString': {
              $dateFromString: {
                dateString: '$transactions.transactionDate',
                format: '%d-%m-%Y',
              },
            },
          },
        },
        {
          $match: {
            'transactions.dateString': matchDate,
          },
        },
      );
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  pipeline.push({
    $facet: {
      totalData: [{ $skip: skip }, { $limit: Number(limit) }],
      
      totalCount: [{ $count: 'count' }],
    },
  });
 
console.log(pipeline)
  try {
    const result = await Transaction.aggregate(pipeline);
    const transactions = result[0].totalData;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    res.status(200).json({
      transactions,
      totalCount,
      totalPages,
      currentPage: Number(page),
    });
   
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
