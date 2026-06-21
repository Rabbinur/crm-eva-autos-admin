import { laravelApi } from "../laravelApi";

const priceRulesApi = laravelApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRules: builder.query({
      query: () => "/admin/product-price-rules",
      providesTags: ["price-rules"],
    }),

    updatePriceRules: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/product-price-rules/${id}`,
        method: "PUT",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["price-rules"],
    }),
  }),
});

export const { useGetAllRulesQuery, useUpdatePriceRulesMutation } =
  priceRulesApi;
