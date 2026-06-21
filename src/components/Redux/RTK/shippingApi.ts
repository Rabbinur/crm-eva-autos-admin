import { laravelApi } from "../laravelApi";

const shippingApi = laravelApi.injectEndpoints({
    endpoints: (builder) => ({
        getShipping: builder.query({
            query: () => ({
                url: "/admin/shippings",
                method: "GET",
            }),
            providesTags: ["shipping"] as any,
        }),
        createShipping: builder.mutation({
            query: ({ payload }) => ({
                url: "/admin/shippings",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["shipping"] as any,
        }),
        editShipping: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/admin/shippings/${id}`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["shipping"] as any,
        }),
        deleteShipping: builder.mutation({
            query: ({ id }) => ({
                url: `/admin/shipping/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["shipping"] as any,
        }),

    }),
});

export const {
    useGetShippingQuery,
    useCreateShippingMutation,
    useEditShippingMutation,
    useDeleteShippingMutation,
} = shippingApi;
export default shippingApi;
