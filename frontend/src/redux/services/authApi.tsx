import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../interfaces/interface";
const config = {
  headers: {
    "Content-type": "application/json",
  },
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/user" }),
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
    }),
    signup: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
        headers: config.headers,
      }),
    }),
  }),
});
export const { useLoginMutation, useSignupMutation } = authApi;
