import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypes } from "@/constants/tagTypes";
import { baseQueryWithUnauthorizedHandler } from "./baseQueryWithUnauthorizedHandler";

export const laravelApi = createApi({
  reducerPath: "laravelApi",
  baseQuery: baseQueryWithUnauthorizedHandler(process.env.NEXT_PUBLIC_API_BASE_URL_LARAVEL!),
  tagTypes,
  endpoints: () => ({}),
});
