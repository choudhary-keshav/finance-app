import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Stack, Select, Radio, RadioGroup, Button } from "@chakra-ui/react";
import { useDeleteTransactionApiMutation } from "../../redux/services/deleteTransactionApi";
import { useEditTransactionApiMutation } from "../../redux/services/editTransactionApi";
import { useLazyViewTransactionQuery } from "../../redux/services/viewTransactionApi";
import { Transaction } from "../../interfaces/interface";
import "./ViewExpense.styled.css";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TransactionModal from "../../pages/modals/TransactionModal";
import TransactionDeleteModal from "../../pages/modals/TransactionDeleteModal";
import { toast } from "react-toastify";

export const ViewExpense = () => {
  const [deleteTransactionApi] = useDeleteTransactionApiMutation();
  const [editTransactionApi] = useEditTransactionApiMutation();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransactionType, setSelectedTransactionType] = useState<boolean | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>();
  const [transactionId, setTransactionId] = useState<string>();
  const [transactionFormData, setTransactionFormData] = useState({
    userId: "",
    transactionId: "",
    transactionDate: "",
    description: "",
    amount: "",
    type: "",
    balance: "",
    category: "",
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [trigger] = useLazyViewTransactionQuery();
  const queryParams = {
    period: selectedOption,
    category: selectedCategory,
    isDebit: selectedTransactionType,
    customPeriodStart: selectedOption === "custom" ? formatDate(fromDate) : undefined,
    customPeriodEnd: selectedOption === "custom" ? formatDate(toDate) : undefined,
    page: currentPage,
    limit: 10,
  };

  useEffect(() => {
    trigger(queryParams).then((response: any) => {
      if (response.data) {
        setTotalPages(response.data.totalPages);
        setTransactions(response.data.transactions);
      }
    });
  }, [selectedOption, selectedCategory, selectedTransactionType, fromDate, toDate, currentPage]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
    setCurrentPage(1);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleTransactionTypeChange = (value: string) => {
    setSelectedTransactionType(value === "debit" ? true : value === "credit" ? false : undefined);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEditClick = (transaction: Transaction, transaction_id: string) => {
    setUserId(transaction._id);
    setTransactionId(transaction_id);
    setTransactionFormData({
      userId: transaction._id,
      transactionId: transaction.transactions._id,
      transactionDate: transaction.transactions.transactionDate,
      description: transaction.transactions.description,
      amount: transaction.transactions.debit || transaction.transactions.credit,
      type: transaction.transactions.debit ? "debit" : "credit",
      balance: transaction.transactions.balance,
      category: transaction.transactions.category,
    });
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleTransactionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTransactionFormData({
      ...transactionFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransactionFormSubmit = async () => {
    try {
      transactionFormData.transactionDate = DateTime.fromISO(
        transactionFormData.transactionDate
      ).toFormat("dd-MM-yyyy");
      const response = await editTransactionApi({
        userId,
        transactionId,
        transactionFormData,
      }).unwrap();

      const updatedTransaction = response.transactions.find(
        (transaction: Transaction) => transaction._id === transactionId
      );
      setTransactions((prevTransactions) => {
        const newTransactions = prevTransactions.map((eachTransaction) => {
          if (eachTransaction.transactions._id === transactionId) {
            return {
              ...eachTransaction,
              transactions: {
                ...eachTransaction.transactions,
                description: updatedTransaction.description,
                debit: updatedTransaction.debit,
                credit: updatedTransaction.credit,
                transactionDate: updatedTransaction.transactionDate,
                balance: updatedTransaction.balance,
                category: updatedTransaction.category,
              },
            };
          }
          return eachTransaction;
        });
        return newTransactions;
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteButton = (transaction: Transaction, transaction_id: string) => {
    const userId = transaction._id;
    const transactionId = transaction.transactions._id;
    setUserId(userId);
    setTransactionId(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (userId: string, transactionId: string) => {
    try {
      await deleteTransactionApi({ userId, transactionId }).unwrap();
      console.log(`Transaction with ID ${transactionId} deleted successfully.`);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.transactions._id !== transactionId)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(`Error deleting transaction with ID ${transactionId}:`, error);
    }
  };

  const handleCategoryNewTransaction = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTransactionFormData({
      ...transactionFormData,
      category: e.target.value,
    });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  return (
    <div className="viewExpense-main-container">
      <div className="viewExpense-sub-container">
        <Select value={selectedOption} onChange={handleSelectChange} placeholder="All" width="250px">
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="custom">Custom</option>
        </Select>
        {selectedOption === "custom" && (
          <>
            <input type="date" placeholder="from" value={fromDate} onChange={handleFromDateChange} />
            <input type="date" placeholder="to" value={toDate} onChange={handleToDateChange} />
          </>
        )}
        <Select value={selectedCategory} onChange={handleCategoryChange} placeholder="All" width="250px">
          <option value="Food">Food</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </Select>
        <RadioGroup onChange={handleTransactionTypeChange}>
          <Stack direction="row">
            <Radio value="debit">Debit</Radio>
            <Radio value="credit">Credit</Radio>
            <Radio value="">All</Radio>
          </Stack>
        </RadioGroup>
      </div>
      <div className="viewExpense-table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th style={{ borderTopLeftRadius: 10 }}>Transaction Date</th>
              <th>Description</th>
              {selectedTransactionType === true && <th>Debit</th>}
              {selectedTransactionType === false && <th>Credit</th>}
              <th>Balance</th>
              <th>Category</th>
              <th style={{ borderTopRightRadius: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((transaction: Transaction, i: number) => {
                const isDebit = i % 2 === 0 ? "debit" : "credit";
                const { transactionDate, description, debit, credit, balance, category, _id } =
                  transaction.transactions;

                return (
                  <tr key={_id}>
                    <td className={isDebit}>{transactionDate}</td>
                    <td className={isDebit}>{description}</td>
                    {selectedTransactionType === true && <td className={isDebit}>{debit}</td>}
                    {selectedTransactionType === false && <td className={isDebit}>{credit}</td>}
                    <td className={isDebit}>{balance}</td>
                    <td className={isDebit}>{category}</td>
                    <td className={isDebit}>
                      <Button onClick={() => handleEditClick(transaction, _id)}>
                        <EditIcon />
                      </Button>
                      <Button onClick={() => handleDeleteButton(transaction, _id)}>
                        <DeleteIcon />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="pagination-controls">
          <Button onClick={() => handlePageChange(currentPage - 1)} isDisabled={currentPage === 1}>
            {"<"}
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button key={index} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1}>
              {index + 1}
            </Button>
          ))}
          <Button onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
            {">"}
          </Button>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionFormData={transactionFormData}
        handleTransactionFormChange={handleTransactionFormChange}
        handleTransactionFormSubmit={handleTransactionFormSubmit}
        handleCategoryNewTransaction={handleCategoryNewTransaction}
        isEditing={isEditing}
      />

      <TransactionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => handleDelete(userId!, transactionId!)}
      />
    </div>
  );
};
