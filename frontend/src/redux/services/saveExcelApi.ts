import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const saveExcelApi = createApi({
  reducerPath: "saveExcelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    saveExcelData: builder.mutation({
      query: ({ excelData, selectedCategories, userId }) => ({
        url: "/saveExcelData",
        method: "POST",
        body: {
          excelData,
          selectedCategories,
          userId,
        },
      }),
    }),
  }),
});

export const { useSaveExcelDataMutation } = saveExcelApi;

export default saveExcelApi;
