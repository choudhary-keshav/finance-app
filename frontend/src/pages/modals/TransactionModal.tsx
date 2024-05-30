import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
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

interface TransactionModalProps {
  totalBalance?: number|null;
  isOpen: boolean;
  onClose: () => void;
  transactionFormData: {
    transactionDate: string;
    description: string;
    amount: string;
    type: string;
    balance: string;
    category: string;
  };
  handleTransactionFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleTransactionFormSubmit: () => void;
  handleCategoryNewTransaction: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  totalBalance,
  isOpen,
  onClose,
  transactionFormData,
  handleTransactionFormChange,
  handleTransactionFormSubmit,
  handleCategoryNewTransaction,
  isEditing
}) => {
  const [balance, setBalance] = useState<any>(totalBalance)
  console.log(balance)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit Transaction" : "Add Transaction"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Transaction Date</FormLabel>
            <Input
              type="date"
              name="transactionDate"
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
            />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select
              name="type"
              value={transactionFormData.type}
              onChange={(e)=>{
                handleTransactionFormChange(e)
                console.log(e.target.value)
                console.log(transactionFormData)
                if(Number(transactionFormData.amount)){
                  if(e.target.value === 'debit'){
                    let temp = Number(totalBalance) - Number(transactionFormData.amount)
                    transactionFormData.balance = String(temp)
                    setBalance(temp)
                  }
                  else if(e.target.value === 'credit'){
                    let temp = Number(totalBalance) + Number(transactionFormData.amount)
                    transactionFormData.balance = String(temp)
                    setBalance(temp)
                  }
                  console.log(transactionFormData)
                }
              }}
              placeholder="Select type"
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Balance</FormLabel>
            <Input
              type="text"
              name="balance"
              value={balance}
              // onChange={handleTransactionFormChange}
              placeholder="Balance"
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
          <Button onClick={handleTransactionFormSubmit} colorScheme="blue" mr={3}>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;
