import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Stack } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useLazyViewTransactionQuery } from "../../redux/services/viewTransactionApi";
import { Transaction } from "../../interfaces/interface";
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

  const [trigger, { data }] = useLazyViewTransactionQuery();
  const queryParams = {
    period: selectedOption,
    category: selectedCategory,
    isDebit: selectedTransactionType,
    customPeriodStart: selectedOption === "custom" ? formatDate(fromDate) : undefined,
    customPeriodEnd: selectedOption === "custom" ? formatDate(toDate) : undefined,
  };

  useEffect(() => {
    trigger(queryParams);
  }, [selectedOption, selectedCategory, selectedTransactionType, fromDate, toDate]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Transactions made with this user account</TableCaption>
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
            {data &&
              data.map((transaction: Transaction) => (
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
