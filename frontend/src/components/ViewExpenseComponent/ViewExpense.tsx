import React, { useState, useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useLazyViewTransactionQuery } from "../../redux/services/viewTransactionApi";
import { Transaction } from "../../interfaces/interface";
import { Radio, RadioGroup, Button } from "@chakra-ui/react";
import "./ViewExpense.styled.css";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

export const ViewExpense = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransactionType, setSelectedTransactionType] = useState<boolean | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
        console.log(response.data);
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
    if (value === "debit") {
      setSelectedTransactionType(true);
    } else if (value === "credit") {
      setSelectedTransactionType(false);
    } else {
      setSelectedTransactionType(undefined);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    console.log("pages", currentPage, totalPages);
  };


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
          <option value="food">Food</option>
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
              {selectedTransactionType !== false && <th>Debit</th>}
              {selectedTransactionType !== true && <th>Credit</th>}
              <th>Balance</th>
              <th>Category</th>
              <th style={{ borderTopRightRadius: 10 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions &&
              transactions.map((transaction: Transaction, i: any) => (
                <tr>
                  <td className={i%2===0 ? "debit" : "credit"}>
                    {transaction.transactions.transactionDate}
                  </td>
                  <td className={i%2===0 ? "debit" : "credit"}>
                    {transaction.transactions.description}
                  </td>
                  {selectedTransactionType !== false && (
                    <td className={i%2===0 ? "debit" : "credit"}>
                      {transaction.transactions.debit}
                    </td>
                  )}
                  {selectedTransactionType !== true && (
                    <td className={i%2===0 ? "debit" : "credit"}>
                      {transaction.transactions.credit}
                    </td>
                  )}
                  <td className={i%2===0 ? "debit" : "credit"}>
                    {transaction.transactions.balance}
                  </td>
                  <td className={i%2===0 ? "debit" : "credit"}>
                    {transaction.transactions.category}
                  </td>
                  <td className={i%2===0 ? "debit" : "credit"}>
                    <EditIcon />{" "}
                    <button onClick={() => console.log("riitka")}>
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


        <div className="pagination-controls">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className={currentPage === index + 1 ? "currentPage" : "otherPage"}
            >
              {index + 1}
            </Button>
          ))}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
};
