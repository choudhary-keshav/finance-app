import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UpdatedUser } from "../../interfaces/interface";
import { PieData } from "../../interfaces/transaction";
export const updateUserApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/user",
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
      UpdatedUser,
      {
        updatedName: string;
        updatedEmail: string;
        updatedPassword?: string;
      }
    >({
      query: ({ updatedName, updatedEmail, updatedPassword }) => {
        const params = new URLSearchParams();
        if (updatedName) params.append("updatedName", updatedName);
        if (updatedEmail) params.append("updatedEmail", updatedEmail);
        if (updatedPassword) params.append("updatedPassword", updatedPassword);
        return {
          url: `/update?${params.toString()}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const { useLazyViewTransactionQuery } = updateUserApi;
