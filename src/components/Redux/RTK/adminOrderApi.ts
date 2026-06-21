import { nodeApi } from "../nodeApi";


const adminOrderApi = nodeApi.injectEndpoints({
    endpoints: (builder) => ({
        // ✅ Get list of designer orders with pagination
        getAdminOrders: builder.query({
            query: ({
                page = 1,
                limit = 10,
                order_id,
                category_id,
                product_id,
                phone,
                user,
                email,
                order_type,
                digital_proof,
                job_sample,
                start_date,
                end_date,
                search_query,
                status,
                sub_status,
                date,
            }: {
                page?: number;
                limit?: number;
                order_id?: string;
                category_id?: string;
                product_id?: string;
                phone?: string;
                user?: string;
                email?: string;
                order_type?: string;
                digital_proof?: string | boolean;
                job_sample?: string | boolean;
                start_date?: string;
                end_date?: string;
                search_query?: string;
                status?: string;
                sub_status?: string;
                date?: string;
            }) => {

                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                //  order_id → search_query
                const finalSearchQuery = order_id || search_query;

                if (finalSearchQuery)
                    params.append("search_query", finalSearchQuery);
                // Dynamically append filters only when they exist
                // if (order_id) params.append("order_id", order_id);
                if (category_id) params.append("category_id", category_id);
                if (product_id) params.append("product_id", product_id);
                if (phone) params.append("phone", phone);
                if (user) params.append("user", user);
                if (email) params.append("email", email);
                if (order_type) params.append("order_type", order_type);
                // if (digital_proof !== undefined) params.append("digital_proof", digital_proof.toString());
                // if (job_sample !== undefined) params.append("job_sample", job_sample.toString());
                if (start_date) params.append("start_date", start_date);
                if (end_date) params.append("end_date", end_date);
                // if (search_query) params.append("search_query", search_query);

                // Existing fields
                if (status) params.append("status", status);
                if (sub_status) params.append("sub_status", sub_status);
                if (date) params.append("date", date);

                return {
                    url: `/admin/orders?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["adminOrders"],
        }),
        // ✅ Get single  order details by ID
        getAdminOrderDetailsById: builder.query({
            query: (id: string) => ({
                url: `/admin/orders/${id}`,
                method: "GET",
            }),
            providesTags: ["adminOrders"],
        }),

        deleteOrder: builder.mutation({
            query: (id: string) => ({
                url: `/admin/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["adminOrders"],
        }),

        // ✅ Get single  order details by Order ID
        getAdminOrderById: builder.query({
            query: (id: string) => ({
                url: `/admin/orders/${id}`,
                method: "GET",
            }),
            providesTags: ["adminOrders"],
        }),
        // ✅ Get list of custom orders with pagination
        getAdminCustomOrders: builder.query({
            query: ({
                page = 1,
                limit = 10,
                order_id,
                category_id,
                product_id,
                phone,
                user,
                email,
                order_type,
                digital_proof,
                job_sample,
                start_date,
                end_date,
                search_query,
                status,
                sub_status,
                date,
            }: {
                page?: number;
                limit?: number;
                order_id?: string;
                category_id?: string;
                product_id?: string;
                phone?: string;
                user?: string;
                email?: string;
                order_type?: string;
                digital_proof?: string | boolean;
                job_sample?: string | boolean;
                start_date?: string;
                end_date?: string;
                search_query?: string;
                status?: string;
                sub_status?: string;
                date?: string;
            }) => {

                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                //  order_id → search_query
                const finalSearchQuery = order_id || search_query;

                if (finalSearchQuery)
                    params.append("search_query", finalSearchQuery);
                // Dynamically append filters only when they exist
                // if (order_id) params.append("order_id", order_id);
                if (category_id) params.append("category_id", category_id);
                if (product_id) params.append("product_id", product_id);
                if (phone) params.append("phone", phone);
                if (user) params.append("user", user);
                if (email) params.append("email", email);
                if (order_type) params.append("order_type", order_type);
                // if (digital_proof !== undefined) params.append("digital_proof", digital_proof.toString());
                // if (job_sample !== undefined) params.append("job_sample", job_sample.toString());
                if (start_date) params.append("start_date", start_date);
                if (end_date) params.append("end_date", end_date);
                // if (search_query) params.append("search_query", search_query);

                // Existing fields
                if (status) params.append("status", status);
                if (sub_status) params.append("sub_status", sub_status);
                if (date) params.append("date", date);

                return {
                    url: `/admin/custom-orders?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["adminCustomOrders"],
        }),
        // ✅ Get single custom  order details by ID
        getAdminCustomOrderDetailsById: builder.query({
            query: (id: string) => ({
                url: `/admin/custom-orders/${id}`,
                method: "GET",
            }),
            providesTags: ["adminCustomOrders"],
        }),


        // custom order turnaround time action
        updateTurnaround: builder.mutation<
            any,
            {
                orderId: string; data: {
                    turnaround_label: string;
                    turnaround_value?: number;
                    price: number;
                }
            }
        >({
            query: ({ orderId, data }) => ({
                url: `/admin/custom-orders/${orderId}/turnaround`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminCustomOrders"],
        }),
        // custom order turnaround time action
        updateCustomOrderShipping: builder.mutation<
            any,
            {
                orderId: string; data: {
                    name: string;
                    price: number;
                    productionFacility?: string;
                }
            }
        >({
            query: ({ orderId, data }) => ({
                url: `/admin/custom-orders/${orderId}/shipping-method`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminCustomOrders"],
        }),


        // custom order payment  action
        updateCustomOrderPayment: builder.mutation<
            any,
            {
                orderId: string;
                data: {
                    baseSubtotal: number;
                    subtotal: number;
                    digitalProofs?: number;
                    jobSample?: number;
                    totalTurnaround?: number;
                    totalShipping?: number;
                    totalTax?: number;
                    extrasTotal?: number;
                    sourceTotal: number;
                    total: number;
                };
            }
        >({
            query: ({ orderId, data }) => ({
                url: `/admin/custom-orders/${orderId}/price-configuration`, // ✅ FIXED
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminCustomOrders"],
        }),







        // ✅ Send order for review
        sendOrderForReview: builder.mutation({
            query: (data: any) => ({
                url: "common/order/designer/action",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),

        getAllPrinters: builder.query({
            query: () => ({
                url: "/designer/printers",
                method: "GET",
            }),

        }),
        // EXISTING — assign printer/designer
        assignPrinter: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/${id}/assign`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),
        // ✅ Assign printer or designer to order
        // NEW — Assign admin (assigner) that assigns the job
        assignAssigner: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/${id}/assign`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),
        // NEW — Assign Resubmitted Designer (assigner) that assigns the job
        assignResubmittedDesigner: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/${id}/accept-update-files-assign-designer`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),

        // ✅ Update order status
        updateOrderStatus: builder.mutation({
            query: ({ orderId, data }: { orderId: string; data: any }) => ({
                url: `/admin/orders/${orderId}/status`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),
        // ✅ Update to hold status order
        updateToHoldOrderStatus: builder.mutation({
            query: ({ orderId, reason }: { orderId: string; reason: any }) => ({
                url: `/admin/orders/${orderId}/hold`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["adminOrders"],
        }),
        // ✅ Update to hold status order
        updateToCancelOrderStatus: builder.mutation({
            query: ({ orderId, reason }: { orderId: string; reason: any }) => ({
                url: `/admin/orders/${orderId}/cancel`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["adminOrders"],
        }),

        // ✅ cancel custom order api
        updateCustomOrderCancel: builder.mutation({
            query: ({ orderId, reason }: { orderId: string; reason: any }) => ({
                url: `/admin/custom-orders/${orderId}/cancel`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["adminOrders"],
        }),
        //delete custom order
        deleteCustomOrder: builder.mutation({
            query: (id: string) => ({
                url: `/admin/custom-orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["adminOrders"],
        }),

        // ✅ Update order status
        updateHoldOrderStatus: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/${id}/hold-request`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),

        //accepted resubmitted files 
        acceptedResubmittedFiles: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/updated-files/${id}/approve`,
                method: "PATCH",
                // body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),
        //rejected resubmitted files 
        rejectedResubmittedFiles: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/admin/orders/updated-files/${id}/reject/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["adminOrders"],
        }),
    }),
});

export const {
    useGetAdminOrdersQuery,
    useGetAdminCustomOrdersQuery,
    useGetAdminCustomOrderDetailsByIdQuery,
    useUpdateTurnaroundMutation,
    useUpdateCustomOrderPaymentMutation,
    useUpdateCustomOrderShippingMutation,
    useGetAdminOrderDetailsByIdQuery,
    useGetAdminOrderByIdQuery,
    useSendOrderForReviewMutation,
    useDeleteOrderMutation,
    useAssignAssignerMutation,
    useUpdateToHoldOrderStatusMutation,
    useUpdateToCancelOrderStatusMutation,
    useUpdateOrderStatusMutation,
    useUpdateHoldOrderStatusMutation,
    useGetAllPrintersQuery,
    useAssignResubmittedDesignerMutation,
    useAcceptedResubmittedFilesMutation,
    useRejectedResubmittedFilesMutation,
    useUpdateCustomOrderCancelMutation,
    useDeleteCustomOrderMutation
} = adminOrderApi;
