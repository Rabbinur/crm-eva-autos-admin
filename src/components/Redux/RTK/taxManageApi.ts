import { laravelApi } from "../laravelApi";

export const taxManageApi = laravelApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaxList: builder.query({
      query: (page = 1) => ({
        url: `admin/taxes?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Taxes"],
    }),
    // ✅ Create Tax
    createTax: builder.mutation({
      query: (body) => ({
        url: "admin/taxes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Taxes"],
    }),

    // ✅ Get Tax by ID
    getTaxById: builder.query<any, string>({
      query: (taxId) => ({
        url: `admin/taxes/${taxId}`,
        method: "GET",
      }),
      providesTags: ["Taxes"],
    }),

    // ✅ Update Tax
    updateTax: builder.mutation({
      query: ({ taxId, data }) => ({
        url: `admin/taxes/${taxId}`,
        method: "PUT", // backend PATCH হলে PUT → PATCH করে দিও
        body: data,
      }),
      invalidatesTags: ["Taxes"],
    }),

    // ✅ Delete Tax
    deleteTax: builder.mutation<any, string>({
      query: (taxId) => ({
        url: `admin/taxes/${taxId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Taxes"],
    }),
  }),
});

export const {
  useCreateTaxMutation,
  useGetTaxListQuery,

  useGetTaxByIdQuery,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxManageApi;
