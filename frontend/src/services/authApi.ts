import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_AUTH_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        const cleanToken = token.startsWith('"') ? JSON.parse(token) : token;
        headers.set("authorization", `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // LOGIN MUTATION
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (err) {
          console.error("Login Error:", err);
        }
      },
      invalidatesTags: ["User"],
    }),

    // GET USER DETAILS
    getUserDetails: builder.query({
      query: () => "getUserDetails",
      providesTags: ["User"],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (err) {
          console.error("Fetch Details Error:", err);
        }
      },
    }),

    // UPDATE PROFILE IMAGE
    updateProfileImage: builder.mutation({
      query: (formData) => ({
        url:
