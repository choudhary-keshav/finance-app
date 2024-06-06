import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Transaction } from "../../interfaces/interface";
export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token.replace(/^"|"$/g, "")}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    viewTransaction: builder.query<
      Transaction[],
      {
        category?: string;
        isDebit?: boolean;
        period?: string;
        customPeriodStart?: string;
        customPeriodEnd?: string;
        group?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ category, isDebit, period, customPeriodStart, customPeriodEnd, group, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (isDebit !== undefined) params.append("isDebit", isDebit.toString());
        if (period) params.append("period", period);
        if (customPeriodStart) params.append("customPeriodStart", customPeriodStart);
        if (customPeriodEnd) params.append("customPeriodEnd", customPeriodEnd);
        if (group) params.append("group", group);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        return {
          url: `/getTransactions?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLazyViewTransactionQuery } = transactionApi;
