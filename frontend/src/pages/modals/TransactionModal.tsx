import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Stack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { TransactionModalProps } from "../../interfaces/interface";

const TransactionModal: React.FC<TransactionModalProps> = ({
  totalBalance,
  isOpen,
  onClose,
  transactionFormData,
  handleTransactionFormChange,
  handleTransactionFormSubmit,
  handleCategoryNewTransaction,
  isEditing,
}) => {
  const [balance, setBalance] = useState<any>(totalBalance);
  useEffect(() => {
    setBalance(totalBalance);
  }, [totalBalance]);

  useEffect(() => {
    if(!isEditing){
      transactionFormData.balance = String(balance);
    }
  }, [balance, transactionFormData]);

  const handleTypeChange = (value: string) => {
    handleTransactionFormChange({
      target: { name: "type", value },
    } as React.ChangeEvent<HTMLInputElement>);

    if (Number(transactionFormData.amount)) {
      let newBalance;
      const initialBalance = totalBalance ?? 0; 
      if (value === "credit") {
        newBalance = initialBalance + Number(transactionFormData.amount);
      } else if (value === "debit") {
        newBalance = initialBalance - Number(transactionFormData.amount);
      }
      setBalance(newBalance);
    }
  };
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Edit Transaction" : "Add Transaction"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Transaction Date</FormLabel>
            <Input
              type="date"
              name="transactionDate"
              max={currentDate}
              value={transactionFormData.transactionDate}
              onChange={handleTransactionFormChange}
              placeholder="Transaction Date"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={transactionFormData.description}
              onChange={handleTransactionFormChange}
              placeholder="Description"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input
              type="text"
              name="amount"
              value={transactionFormData.amount}
              onChange={handleTransactionFormChange}
              placeholder="Amount"
              readOnly={isEditing}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              name="type"
              value={transactionFormData.type}
              onChange={(e) => handleTypeChange(e as unknown as string)}
            >
              <Stack direction="row">
                <Radio value="debit" isDisabled={isEditing}>Debit</Radio>
                <Radio value="credit" isDisabled={isEditing}>Credit</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Balance</FormLabel>
            <Input
              type="text"
              name="balance"
              value={isEditing ? transactionFormData.balance : balance}
              onChange={handleTransactionFormChange}
              placeholder="Balance"
              readOnly={isEditing}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={transactionFormData.category}
              onChange={handleCategoryNewTransaction}
              placeholder="Select category"
            >
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleTransactionFormSubmit}
            colorScheme="blue"
            mr={3}
          >
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;
