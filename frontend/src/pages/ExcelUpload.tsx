import React, { useState } from "react";
import * as XLSX from "xlsx";
import { DateTime } from "luxon";
import {
  Select,
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";

const ExcelUploader: React.FC = () => {
  const [excelData, setExcelData] = useState<(string | null | undefined)[][]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transactionFormData, setTransactionFormData] = useState({
    transactionDate: "",
    description: "",
    debit: "",
    credit: "",
    balance: "",
    category: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const serialNumberToDate = (serialNumber: number): string => {
    const millisecondsSinceUnixEpoch = (serialNumber - 25569) * 86400 * 1000;
    const luxonDateTime = DateTime.fromMillis(millisecondsSinceUnixEpoch);
    const formattedDate = luxonDateTime.toFormat("dd-MM-yyyy");
    return formattedDate;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: (string | null | undefined)[][] =
        XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: null,
        });

      const filteredData = jsonData
        .filter((row: (string | null | undefined)[]) =>
          row.some((cell) => cell !== null && cell !== undefined)
        )
        .map((row: (string | null | undefined)[]) =>
          row.map((cell, index) =>
            index === 0
              ? serialNumberToDate(Number(cell || 0))
              : cell === null || cell === undefined
              ? ""
              : cell
          )
        );

      setExcelData(filteredData.slice(1));
      setSelectedCategories(new Array(filteredData.length - 1).fill(""));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index] = value;
    setSelectedCategories(updatedCategories);
  };

  const handleTransactionFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransactionFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTransactionFormSubmit = () => {

    if(!transactionFormData.transactionDate || !transactionFormData.description){
      console.log("Enter transaction date and description")
      return
    }
    const updatedExcelData = [
      ...excelData,
      [
        transactionFormData.transactionDate,
        transactionFormData.description,
        transactionFormData.debit,
        transactionFormData.credit,
        transactionFormData.balance,
      ],
    ];
    setExcelData(updatedExcelData);

    setTransactionFormData({
      transactionDate: "",
      description: "",
      debit: "",
      credit: "",
      balance: "",
      category: "",
    });

    onClose(); 
  };

  const handleSaveData = async () => {
    try {
      const userInfoString = localStorage.getItem("userInfo");

      if (!userInfoString) {
        console.error("User information not found in local storage");
        return;
      }

      const userInfo = JSON.parse(userInfoString);

      if (!userInfo || !userInfo._id) {
        console.error("User information invalid or missing _id");
        return;
      }

      const userId = userInfo._id;

      const response = await axios.post(
        "http://localhost:5000/api/saveExcelData",
        {
          excelData,
          selectedCategories,
          userId,
        }
      );

      console.log("Data saved:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

    const handleCategoryNewTransaction = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      handleTransactionFormChange(e);
      console.log(e.target.value)
      handleCategoryChange(excelData.length,e.target.value)
    };

  return (
    <div className="excel-table-container">
      <input type="file" onChange={handleFileUpload} />
      {excelData.length>0 && (
        <div>
          <table className="excel-table">
            <thead>
              <tr>
                <th>Transaction Date</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <Select
                      value={selectedCategories[rowIndex] || ""}
                      onChange={(e) =>
                        handleCategoryChange(rowIndex, e.target.value)
                      }
                      placeholder="Select category"
                    >
                      <option value="food">Food</option>
                      <option value="travel">Travel</option>
                      <option value="other">Other</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button onClick={handleSaveData} colorScheme="blue" mt="4">
            Save Data
          </Button>
        </div>
      )}
      <Button onClick={onOpen} colorScheme="blue" mt="4">
        Add a single transaction
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a single transaction</ModalHeader>
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
              <FormLabel>Debit</FormLabel>
              <Input
                type="text"
                name="debit"
                value={transactionFormData.debit}
                onChange={handleTransactionFormChange}
                placeholder="Debit"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Credit</FormLabel>
              <Input
                type="text"
                name="credit"
                value={transactionFormData.credit}
                onChange={handleTransactionFormChange}
                placeholder="Credit"
              />
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
              Add Transaction
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExcelUploader;
