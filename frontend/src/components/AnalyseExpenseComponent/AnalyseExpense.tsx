import React, { useState, useEffect } from "react";
import MyResponsivePie from "../PieChart/Pie";
import Bar from "../BarGraph/Bar";
import { useViewTransactionQuery as usePieApi } from "../../redux/services/analyseTransactionPieApi";
import { useViewTransactionQuery as useBarApi } from "../../redux/services/analyseTransactionBarApi";
import { BarData, BarNivoData, PieData, PieNivoData } from "../../interfaces/transaction";
import "./styles.css";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { SerializedError } from "@reduxjs/toolkit";

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
        color: getColor(transaction._id),
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
        // Check if the date is in "YYYY/M" format
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

  const barQuery: BarQuery = { group: "bar" };
  category !== "All" && (barQuery.category = category);
  type !== "All" && (barQuery.isDebit = type === "debit" ? true : false);
  period !== "All" && (barQuery.period = period);

  const creditPieQuery: PieQuery = { ...barQuery, group: "pie", isDebit: false };
  const debitPieQuery = { ...creditPieQuery, isDebit: true };
  const { data: creditPieData, isLoading: isCreditPieLoading, error: creditPieFetchError } = usePieApi(creditPieQuery);
  const { data: debitPieData, isLoading: isDebitPieLoading, error: debitPieFetchError } = usePieApi(debitPieQuery);
  const { data: barApiData, isLoading: barLoading, error: barFetchError } = useBarApi(barQuery);
  const stateDependencies = [
    barApiData,
    barLoading,
    barFetchError,
    creditPieData,
    debitPieData,
    isCreditPieLoading,
    isDebitPieLoading,
    creditPieFetchError,
    debitPieFetchError,
  ];
  useEffect(() => {
    if (isCreditPieLoading || isDebitPieLoading || barLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    console.log("Bar Data from API:  " + barApiData);
    checkFetchError(barFetchError);
    checkFetchError(creditPieFetchError);
    checkFetchError(debitPieFetchError);

    setNewPieData(creditPieData, "credit", setPieCredit);
    setNewPieData(debitPieData, "debit", setPieDebit);
    setNewBarData(barApiData);
  }, stateDependencies);

  const getColor = (category: string) => {
    switch (category) {
      case "food":
        return "yellow";
      case "travel":
        return "skyblue";
      default:
        return "orange";
    }
  };

  return (
    <div>
      <h1>Number List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <label htmlFor="category">Category: </label>
      <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
        <option value="other">Other</option>
      </select>
      <label htmlFor="type">Type: </label>
      <select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="All">All</option>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
      <label htmlFor="Period">Period: </label>
      <select name="period" id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="All">All</option>
        <option value="thisWeek">thisWeek</option>
        <option value="thisMonth">thisMonth</option>
        <option value="thisYear">thisYear</option>
      </select>
      <div className="flexDiv">
        <div className="pie">
          <h1>Credit Category Chart</h1>
          <MyResponsivePie data={pieCredit} />
        </div>
        <div className="pie">
          <h1>Debit Category Chart</h1>
          <MyResponsivePie data={pieDebit} />
        </div>
      </div>
      <div className="barWrapper">
        <h1>Bar Graph</h1>
        <div className="bar" style={{ width: `${200 + barData.length * 70}px` }}>
          <Bar data={barData} indexBy="date" labelBottom="Date" labelLeft="Money(in ₹)" keys={["debit", "credit"]} />
        </div>
      </div>
    </div>
  );
};
