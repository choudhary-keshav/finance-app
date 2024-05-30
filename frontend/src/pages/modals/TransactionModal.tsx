import React from "react";
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

interface TransactionModalProps {
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
  handleTransactionFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleTransactionFormSubmit: () => void;
  handleCategoryNewTransaction: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditing: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionFormData,
  handleTransactionFormChange,
  handleTransactionFormSubmit,
  handleCategoryNewTransaction,
  isEditing,
}) => {
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
            <RadioGroup
              name="type"
              value={transactionFormData.type}
              onChange={(value) =>
                handleTransactionFormChange({
                  target: { name: "type", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <Stack direction="row">
                <Radio value="debit">Debit</Radio>
                <Radio value="credit">Credit</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Balance</FormLabel>
            <Input
              type="text"
              name="balance"
              value={transactionFormData.balance}
              onChange={handleTransactionFormChange}
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
