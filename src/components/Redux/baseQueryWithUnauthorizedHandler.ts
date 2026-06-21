import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const baseQueryWithUnauthorizedHandler = (
  baseUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if ((result.error as FetchBaseQueryError)?.status === 401) {
      console.log("Unauthorized detected:", result);
      // Optional: handle logout or redirect
    }
    return result;
  };
};
