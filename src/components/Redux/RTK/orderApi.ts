import { laravelApi } from "../laravelApi";

const orderApi = laravelApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get list of designer orders with pagination
    getDesignerOrders: builder.query({
      query: ({
        page = 1,
        items = 10,
        jobId,
        category,
        search_query,
        status,
        sub_status,
        date,
      }: {
        page?: number;
        items?: number;
        jobId?: string;
        category?: string;
        search_query?: string;
        status?: string;
        sub_status?: string;
        date?: string;
      }) => {
        // Build query parameters dynamically
        const params = new URLSearchParams({
          page: page.toString(),
          items: items.toString(),
        });

        if (jobId) params.append("jobId", jobId);
        if (category) params.append("category", category);
        if (search_query) params.append("search_query", search_query);
        if (status) params.append("status", status);
        if (sub_status) params.append("sub_status", sub_status);
        if (date) params.append("date", date);

        return {
          url: `designer/orders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["orders"],
    }),

    // ✅ Get single designer order details by ID
    getDesignerOrderById: builder.query({
      query: (id: string) => ({
        url: `designer/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // ✅ Send order for review
    sendOrderForReview: builder.mutation({
      query: (data: any) => ({
        url: "common/order/designer/action",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders"],
    }),

    getAllPrinters: builder.query({
      query: () => ({
        url: "/designer/printers",
        method: "GET",
      }),

    }),

    // ✅ Assign printer to order
    assignPrinter: builder.mutation({
      query: (data: any) => ({
        url: "common/order/designer/action/assign-printer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders"],
    }),

    // ✅ Update order status
    updateDesignerOrderStatus: builder.mutation({
      query: ({ orderId, data }: { orderId: string; data: any }) => ({
        url: `common/order/designer/${orderId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["orders"],
    }),



  }),
});

export const {
  useGetDesignerOrdersQuery,
  useGetDesignerOrderByIdQuery,
  useSendOrderForReviewMutation,
  useAssignPrinterMutation,
  useUpdateDesignerOrderStatusMutation,
  useGetAllPrintersQuery
} = orderApi;
