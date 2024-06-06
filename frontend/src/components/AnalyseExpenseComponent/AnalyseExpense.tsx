import React, { useState, useEffect } from "react";
import MyResponsivePie from "../PieChart/Pie";
import Bar from "../BarGraph/Bar";
import { useLazyViewTransactionQuery as usePieApi } from "../../redux/services/analyseTransactionPieApi";
import { useLazyViewTransactionQuery as useBarApi } from "../../redux/services/analyseTransactionBarApi";
import { BarData, BarNivoData, PieData, PieNivoData } from "../../interfaces/transaction";
import "./styles.css";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { SerializedError } from "@reduxjs/toolkit";
import { Select } from "@chakra-ui/react";

interface PieQuery {
  category?: string;
  period?: string;
  type?: string;
  group: "pie";
  isDebit: boolean;
}

interface BarQuery {
  category?: string;
  period?: string;
  isDebit?: boolean;
  group: "bar";
}

export const AnalyseExpense = () => {
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [period, setPeriod] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pieCredit, setPieCredit] = useState<PieNivoData[]>([]);
  const [pieDebit, setPieDebit] = useState<PieNivoData[]>([]);
  const [barData, setBarData] = useState<BarNivoData[]>([]);
  const barQuery: BarQuery = { group: "bar" };
  type !== "All" && (barQuery.isDebit = type === "debit" ? true : false);
  period !== "All" && (barQuery.period = period);
  const creditPieQuery: PieQuery = { ...barQuery, group: "pie", isDebit: false };
  const debitPieQuery = { ...creditPieQuery, isDebit: true };
  category !== "All" && (barQuery.category = category);
  const [pieApiTrigger] = usePieApi();
  const [barApiTrigger] = useBarApi();
  const stateDependencies = [category, type, period];

  const checkFetchError = (givenError: FetchBaseQueryError | SerializedError | undefined): void => {
    if (givenError) {
      let errorMessage = "An unknown error occurred";
      if ("status" in givenError) {
        errorMessage = `Error: ${givenError.status}`;
      } else if ("message" in givenError && givenError.message) {
        errorMessage = givenError.message;
      }
      setError(errorMessage);
    } else {
      setError(null);
    }
  };

  const setNewPieData = (
    data: PieData[] | undefined,
    type: "credit" | "debit",
    setData: React.Dispatch<React.SetStateAction<PieNivoData[]>>
  ): void => {
    if (data) {
      const creditTransactions: PieNivoData[] = data.map((transaction: PieData) => ({
        id: transaction._id,
        label: transaction._id,
        value: type === "credit" ? transaction.credit : transaction.debit,
      }));
      setData(creditTransactions);
    } else {
      setData([]);
    }
  };

  const setNewBarData = (data: BarData[] | undefined): void => {
    if (data) {
      const creditTransactions: BarNivoData[] = data.map((transaction: BarData) => {
        let date = "";
        if (transaction._id.day) {
          date = transaction._id.day.toString();
        }
        if (transaction._id.year && transaction._id.month) {
          date = transaction._id.year?.toString() + "/";
          const month = transaction._id.month.toString();
          date += month.length > 1 ? month : "0" + month;
        }
        return {
          date,
          credit: transaction.credit,
          debit: transaction.debit,
        };
      });
      const convertToTimestamp = (date: string): number[] => {
        const dateDetails = date.split("/");
        const dateInNumbers = dateDetails.map((dateDetail) => Number(dateDetail));
        return dateInNumbers;
      };
      creditTransactions.sort((a: BarNivoData, b: BarNivoData) => {
        const aDate = convertToTimestamp(a.date);
        const bDate = convertToTimestamp(b.date);
        if (aDate.length === 1) return aDate[0] - bDate[0];
        else {
          return aDate[0] === bDate[0] ? aDate[1] - bDate[1] : aDate[0] - bDate[0];
        }
      });
      setBarData(creditTransactions);
    } else {
      setBarData([]);
    }
  };

  useEffect(() => {
    pieApiTrigger(creditPieQuery).then((response: any) => {
      if (response.data) {
        setNewPieData(response.data.transactions, "credit", setPieCredit);
      }
    });
    pieApiTrigger(debitPieQuery).then((response: any) => {
      if (response.data) {
        setNewPieData(response.data.transactions, "debit", setPieDebit);
      }
    });
    barApiTrigger(barQuery).then((response: any) => {
      if (response.data) {
        setNewBarData(response.data.transactions);
      }
    });
  }, stateDependencies);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="chakraSelect">
        <label htmlFor="Period">Period: </label>
        <Select name="period" id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="All">All</option>
          <option value="thisWeek">thisWeek</option>
          <option value="thisMonth">thisMonth</option>
          <option value="thisYear">thisYear</option>
        </Select>
      </div>
      <h3>Category Charts</h3>
      <div className="flexDiv piesContainer">
        <div className="pie leftPie">
          <h4>Credit</h4>
          {pieCredit.length ? <MyResponsivePie data={pieCredit} /> : <h6>No Credit Data</h6>}
        </div>
        <div className="pie">
          <h4>Debit </h4>
          {pieDebit.length ? <MyResponsivePie data={pieDebit} /> : <h6>No Debit Data</h6>}
        </div>
      </div>
      <div className="flexDiv bottomCategories">
        <div className="chakraSelect">
          <label htmlFor="type">Type: </label>
          <Select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All</option>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </Select>
        </div>
        <div className="chakraSelect">
          <label htmlFor="category">Category: </label>
          <Select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>
      <br />
      <h2>Bar Graph</h2>
      <div className="barWrapper">
        <div className="bar" style={{ width: `${250 + barData.length * 70}px` }}>
          <Bar data={barData} indexBy="date" labelBottom="Date" labelLeft="Money (in ₹)" keys={["credit", "debit"]} />
        </div>
      </div>
    </div>
  );
};
