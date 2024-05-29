import { useState, useEffect } from "react";
import { Box, Heading, Text, useToast } from "@chakra-ui/react";
import { useLazyViewTransactionQuery } from "../../redux/services/viewTransactionApi"; // Adjust the import path as necessary
import "./Dashboard.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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

const Dashboard: React.FC = () => {
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const toast = useToast();
  const user = useSelector((state: RootState) => state.authentication);
  const [trigger] = useLazyViewTransactionQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await trigger({});
        console.log({ response });

        const data: any = response.data;
        const transactions: Transaction[] = data.transactions;

        if (transactions && Array.isArray(transactions)) {
          let calculatedExpenses = 0;
          let latestBalance = 0;

          transactions.forEach((transaction) => {
            const { debit, credit, balance } = transaction.transactions;
            if (debit) {
              calculatedExpenses += parseFloat(debit);
            }
            latestBalance = parseFloat(balance);
          });

          console.log("Calculated Balance: ", latestBalance);
          console.log("Calculated Expenses: ", calculatedExpenses);
          setTotalExpenses(calculatedExpenses);
          setTotalBalance(latestBalance);
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, [trigger, toast]);

  return (
    <div className="dashboard-main-container">
      <Heading size="md" color="green.500" width="60%">
        Welcome, {user?.data?.name}
      </Heading>
      <div style={{ marginLeft: "40px" }} className="dashboard-sub-container">
        <Box
          marginLeft={30}
          p="30"
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          bg="white"
          width="90vw"
          height="30vh"
          box-shadow=" rgba(0, 0, 0, 0.24) 0px 3px 8px"
        >
          <Text fontSize="2xl" fontWeight="bold" mt="12" mb="5">
            Total Balance
          </Text>
          <Text fontSize="2xl" color="green.500">
            {totalBalance.toFixed(2)}
          </Text>
        </Box>
      </div>
      <div className="dashboard-sub-container">
        <Box
          marginRight={20}
          p="30"
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          bg="white"
          width="90vw"
          height="30vh"
        >
          <Text fontSize="2xl" fontWeight="bold" mt="12" mb="5">
            Total Expenses
          </Text>
          <Text fontSize="2xl" color="red.500">
            {totalExpenses.toFixed(2)}
          </Text>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
