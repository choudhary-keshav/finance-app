import React, { useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Stack } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useViewTransactionQuery } from "../../redux/services/viewTransactionApi";
import { Transaction, TransactionDetails } from "../../interfaces/interface";
import { Radio, RadioGroup } from "@chakra-ui/react";

export const ViewExpense = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState<boolean | undefined>(undefined);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
console.log("ritika", selectedOption);
  const queryParams = {
    period: selectedOption,
    category: selectedCategory,
    isDebit: selectedTransactionType,
    customPeriodStart: selectedOption === "custom" ? formatDate(fromDate) : undefined,
    customPeriodEnd: selectedOption === "custom" ? formatDate(toDate) : undefined,
  };

  const { data: transactions, isLoading } = useViewTransactionQuery(queryParams);
console.log(transactions)
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleFromDateChange = (event: any) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: any) => {
    setToDate(event.target.value);
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };
  const handleTransactionTypeChange = (value: string) => {
    if (value === "debit") {
      setSelectedTransactionType(true);
    } else if (value === "credit") {
      setSelectedTransactionType(false);
    } else {
      setSelectedTransactionType(undefined);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Select value={selectedOption} onChange={handleSelectChange} placeholder="Select option" width="250px">
          <option value="">All</option>
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
        <Select value={selectedCategory} onChange={handleCategoryChange} placeholder="Select categpry" width="250px">
          <option value="">All</option>
          <option value="food">food</option>
          <option value="travel">travel</option>
          <option value="other">other</option>
        </Select>

        <RadioGroup onChange={handleTransactionTypeChange}>
          <Stack direction="row">
            <Radio value="debit">Debit</Radio>
            <Radio value="credit">Credit</Radio>
            <Radio value="">All</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Transaction made with this user account</TableCaption>
          <Thead>
            <Tr>
              <Th>Transaction Date</Th>
              <Th>Description</Th>
              <Th>Debit</Th>
              <Th>Credit</Th>
              <Th>Balance</Th>
              <Th>Category</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions &&
              transactions.map((transaction: Transaction) => (
                <Tr>
                  <Td>{transaction.transactions.transactionDate}</Td>
                  <Td>{transaction.transactions.description}</Td>
                  <Td>{transaction.transactions.debit}</Td>
                  <Td>{transaction.transactions.credit}</Td>
                  <Td>{transaction.transactions.balance}</Td>
                  <Td>{transaction.transactions.category}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
