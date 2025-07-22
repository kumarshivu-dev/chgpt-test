import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL,
    prepareHeaders: async (headers) => {
      const { user } = await getSession();
      if (user?.id_token) headers.set("Authorization", user?.id_token);
      return headers;
    },
  }),

  endpoints: (builder) => ({}),
  tagTypes: ["Channels", "Channel"],
});

export default api;
