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
  const [totalPages, setTotalPages] = useState<number>(1);
  const user = useSelector((state: RootState) => state.authentication);
  const [trigger] = useLazyViewTransactionQuery();

  useEffect(() => {
    const fetchAllPages = async () => {
      let calculatedExpenses = 0;
      let latestBalance = 0;

      try {
        const initialQueryParams = { page: 1, limit: 10 };
        const initialResponse = await trigger(initialQueryParams);
        const initialData: any = initialResponse.data;
        const pages = initialData.totalPages;
        setTotalPages(pages);

        for (let page = 1; page <= pages; page++) {
          const queryParams = { page, limit: 10 };
          const response = await trigger(queryParams);
          const data: any = response.data;
          const transactions: Transaction[] = data.transactions;

          // eslint-disable-next-line no-loop-func, array-callback-return
          transactions.map((transaction) => {
            const { debit, balance } = transaction.transactions;
            if (debit) {
              calculatedExpenses += parseFloat(debit);
            }
            latestBalance = parseFloat(balance);
          });
        }

        setTotalExpenses(calculatedExpenses);
        setTotalBalance(latestBalance);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllPages();
  }, [trigger]);

  return (
    <div className="dashboard-main-container">
      <Heading color="green.500" style={{ fontSize: 40, display: "flex" }}>
        Welcome, {user?.data?.name}
      </Heading>
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "40px" }} className="dashboard-sub-container">
          <Box
            marginLeft={30}
            p="30"
            maxW="md"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            width="90vw"
            height="20vh"
            box-shadow=" rgba(0, 0, 0, 0.24) 0px 3px 8px"
          >
            <Text fontSize="2xl" fontWeight="bold" mt="0" mb="3">
              Total Balance
            </Text>
            <Text color="green.500" style={{ fontSize: 43 }}>
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
            borderRadius="xl"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            width="90vw"
            height="20vh"
          >
            <Text fontSize="2xl" fontWeight="bold" mt="0" mb="3">
              Total Expenses
            </Text>
            <Text color="red.500" style={{ fontSize: 43 }}>
              {totalExpenses.toFixed(2)}
            </Text>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
