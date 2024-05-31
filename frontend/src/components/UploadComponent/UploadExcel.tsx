import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { DateTime } from "luxon";
import { Select, Button, Input, FormControl, FormLabel, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TransactionModal from "../../pages/modals/TransactionModal";
import { isDisabled, isEditable } from "@testing-library/user-event/dist/utils";
import "./UploadExcel.styled.css";
import { useLazyViewTransactionQuery } from "../../redux/services/viewTransactionApi";

interface TransactionFormData {
  transactionDate: string;
  description: string;
  amount: string;
  type: string;
  balance: string;
  category: string;
}
export interface TransactionDetails {
  transactionDate: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  category: string;
  _id: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  transactions: TransactionDetails;
  __v: number;
}
const UploadExcel: React.FC = () => {
  const [excelData, setExcelData] = useState<(string | null | undefined)[][]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [transactionFormData, setTransactionFormData] = useState<TransactionFormData>({
    transactionDate: "",
    description: "",
    amount: "",
    type: "",
    balance: "",
    category: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger] = useLazyViewTransactionQuery();
  useEffect(() => {
    const fetchAllPages = async () => {
      let latestBalance = 0;

      try {
        const initialQueryParams = { page: 1, limit: 10 };
        const initialResponse = await trigger(initialQueryParams);
        const initialData: any = initialResponse.data;
        console.log(initialData);
        const pages = initialData.totalPages;
        setTotalPages(pages);

        for (let page = 1; page <= pages; page++) {
          const queryParams = { page, limit: 10 };
          const response = await trigger(queryParams);
          const data: any = response.data;
          const transactions: Transaction[] = data.transactions;

          // eslint-disable-next-line no-loop-func, array-callback-return
          transactions.map((transaction) => {
            const { balance } = transaction.transactions;
            latestBalance = parseFloat(balance);
            console.log(latestBalance);
          });
        }

        setTotalBalance(latestBalance);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPages();
  }, [trigger]);

  const serialNumberToDate = (serialNumber: number): string => {
    const millisecondsSinceUnixEpoch = (serialNumber - 25569) * 86400 * 1000;
    const luxonDateTime = DateTime.fromMillis(millisecondsSinceUnixEpoch);
    return luxonDateTime.toFormat("dd-MM-yyyy");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("khli h");
      return;
    }

    const validMimeTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".xls", ".xlsx"];

    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const isValidFile = validMimeTypes.includes(file.type) && validExtensions.includes(fileExtension);

    if (!isValidFile) {
      toast.error("Please upload a valid Excel file ('.xls' or '.xlsx').");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: (string | null | undefined)[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: null,
      });

      const filteredData = jsonData
        .filter((row: (string | null | undefined)[]) => row.some((cell) => cell !== null && cell !== undefined))
        .map((row: (string | null | undefined)[]) =>
          row.map((cell, index) => (index === 0 ? serialNumberToDate(Number(cell || 0)) : cell || ""))
        );
      if (filteredData.length <= 1) {
        toast.error("The uploaded file is empty or contains no valid data.");
        setIsFileUploaded(false);
        return;
      }
      setExcelData(filteredData.slice(1));
      setSelectedCategories(filteredData.slice(1).map((row) => (row[5] ? (row[5] as string) : "")));
    };
    setIsFileUploaded(true);
    reader.readAsArrayBuffer(file);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...selectedCategories];
    updatedCategories[index] = value;
    setSelectedCategories(updatedCategories);
  };

  const handleTransactionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransactionFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTransactionFormSubmit = async () => {
    if (!transactionFormData.transactionDate || !transactionFormData.description) {
      console.log("Enter transaction date and description");
      return;
    }

    const formattedDate = DateTime.fromISO(transactionFormData.transactionDate).toFormat("dd-MM-yyyy");

    const updatedExcelData = [
      ...excelData,
      [
        formattedDate,
        transactionFormData.description,
        transactionFormData.type === "debit" ? transactionFormData.amount : "",
        transactionFormData.type === "credit" ? transactionFormData.amount : "",
        transactionFormData.balance,
      ],
    ];
    setExcelData(updatedExcelData);

    setTransactionFormData({
      transactionDate: "",
      description: "",
      amount: "",
      type: "",
      balance: "",
      category: "",
    });

    try {
      const userInfoString = localStorage.getItem("token");
      const decodedToken: {
        payload: {
          _id: string;
          name: string;
          email: string;
          pic: string;
        };
      } = jwtDecode(userInfoString || "");

      if (!userInfoString) {
        console.error("User information not found in local storage");
        return;
      }

      if (!decodedToken.payload._id) {
        console.error("User information invalid or missing _id");
        return;
      }

      const userId = decodedToken.payload._id;

      const response = await axios.post("http://localhost:5000/api/saveExcelData", {
        excelData: updatedExcelData,
        selectedCategories,
        userId,
      });

      toast.success("Transaction added successfully");
      console.log("Data saved:", response.data);
    } catch (error) {
      toast.error("Error saving data");
      console.error("Error saving data:", error);
    }
    setExcelData([]);
    onClose();
  };

  const handleSaveData = async () => {
    try {
      const userInfoString = localStorage.getItem("token");
      const decodedToken: {
        payload: {
          _id: string;
          name: string;
          email: string;
          pic: string;
        };
      } = jwtDecode(userInfoString || "");

      if (!userInfoString) {
        console.error("User information not found in local storage");
        return;
      }

      if (!decodedToken.payload._id) {
        console.error("User information invalid or missing _id");
        return;
      }

      const userId = decodedToken.payload._id;

      const response = await axios.post("http://localhost:5000/api/saveExcelData", {
        excelData,
        selectedCategories,
        userId,
      });

      toast.success("Data saved successfully");
      console.log("Data saved:", response.data);
      setExcelData([]);
    } catch (error) {
      toast.error("Error saving data");
      console.error("Error saving data:", error);
    }
  };

  const handleCategoryNewTransaction = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleTransactionFormChange(e);
    console.log(e.target.value);
    handleCategoryChange(excelData.length, e.target.value);
  };

  return (
    <div className="excel-table-container">
      <div className="upload-excel-form-container">
        <ToastContainer />
        <FormControl>
          <FormLabel>Select Excel File:</FormLabel>
          <Input type="file" onChange={handleFileUpload} w="300px" />
        </FormControl>
        <Button
          size="lg"
          colorScheme="teal"
          onClick={handleSaveData}
          margin="7"
          padding="20px"
          isDisabled={!isFileUploaded}
          width="30%"
        >
          Save Data
        </Button>
        <Button size="lg" colorScheme="teal" onClick={onOpen} margin="7" padding="22px" width="35%">
          Add a single transaction
        </Button>
      </div>

      {excelData.length > 0 && (
        <div>
          <Box margin="4">
            <Table variant="striped" colorScheme="gray">
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
                {excelData.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {row.slice(0, 5).map((cell, cellIndex) => (
                      <Td key={cellIndex}>{cell}</Td>
                    ))}
                    <Td>
                      {selectedCategories[rowIndex] ? (
                        <span>{selectedCategories[rowIndex]}</span>
                      ) : (
                        <Select
                          value={selectedCategories[rowIndex] || ""}
                          onChange={(e) => handleCategoryChange(rowIndex, e.target.value)}
                          placeholder="Select category"
                        >
                          <option value="Food">Food</option>
                          <option value="travel">Travel</option>
                          <option value="other">Other</option>
                        </Select>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </div>
      )}
      <TransactionModal
        totalBalance={totalBalance}
        isOpen={isOpen}
        onClose={onClose}
        transactionFormData={transactionFormData}
        handleTransactionFormChange={handleTransactionFormChange}
        handleTransactionFormSubmit={handleTransactionFormSubmit}
        handleCategoryNewTransaction={handleCategoryNewTransaction}
        isEditing={false}
      />
    </div>
  );
};

export default UploadExcel;
