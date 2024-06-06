import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deleteTransactionApi = createApi({
  reducerPath: "deleteTransactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    deleteTransactionApi: builder.mutation({
      query: ({ userId, transactionId }) => ({
        url: `/deleteTransaction/${userId}/${transactionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteTransactionApiMutation } = deleteTransactionApi;
