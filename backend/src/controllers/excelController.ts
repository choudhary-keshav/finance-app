import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { TransactionModel } from "../models/transactionModel";

const saveExcelData = async (req: Request, res: Response) => {
  try {
    const { userId, excelData, selectedCategories } = req.body;

    let existingTransaction = await TransactionModel.findOne({ userId });

    if (existingTransaction) {
      existingTransaction.transactions = excelData.map(
        (row: any, index: any) => ({
          transactionDate: row[0],
          description: row[1],
          debit: row[2],
          credit: row[3],
          balance: row[4],
          category: selectedCategories[index],
        })
      );

      await existingTransaction.save();
    } else {
      const newTransaction = new TransactionModel({
        userId,
        transactions: excelData.map((row: any, index: any) => ({
          transactionDate: row[0],
          description: row[1],
          debit: row[2],
          credit: row[3],
          balance: row[4],
          category: selectedCategories[index],
        })),
      });

      await newTransaction.save();
      const transactionId = newTransaction._id;

      await UserModel.findByIdAndUpdate(userId, {
        $push: { transactions: transactionId },
      });

    }

    res.status(201).json({ message: "Transactions saved successfully" });
  } catch (error) {
    console.error("Error saving transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { saveExcelData };
