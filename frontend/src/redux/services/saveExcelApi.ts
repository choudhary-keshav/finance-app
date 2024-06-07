import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {SaveExcelDataRequest, SaveExcelDataResponse} from "../../utils/interfaces/interface"

const saveExcelApi = createApi({
  reducerPath: "saveExcelApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    saveExcelData: builder.mutation<SaveExcelDataResponse, SaveExcelDataRequest>({
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
