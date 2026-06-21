import { laravelApi } from "../laravelApi";

const supportApi = laravelApi.injectEndpoints({
  endpoints: (builder) => ({
    ticketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `admin/support/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SupportTickets"],
    }),
    ticketReply: builder.mutation({
      query: ({ ticketId, data }) => ({
        url: `/admin/support/${ticketId}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SupportTickets"],
    }),

    getSupportTickets: builder.query({
      query: () => {
        return {
          url: "admin/support",
          method: "GET",
        };
      },
      providesTags: ["SupportTickets"],
    }),

    getSingleSupportTicket: builder.query({
      query: (ticketId) => {
        return {
          url: `/admin/support/${ticketId}`,
          method: "GET",
        };
      },
      providesTags: ["SupportTickets"],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useTicketReplyMutation,
  useGetSingleSupportTicketQuery,
  useTicketStatusMutation,
} = supportApi;
