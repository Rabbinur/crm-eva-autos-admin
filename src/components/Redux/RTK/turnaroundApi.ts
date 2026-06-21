import { laravelApi } from "../laravelApi";

const turnaroundApi = laravelApi.injectEndpoints({
 endpoints: (builder) => ({
  getTurnaroundTimes: builder.query({
   query: () => ({
    url: "/admin/turnaround-times",
    method: "GET",
   }),
   providesTags: ["turnaround-time"] as any,
  }),
  createTurnaroundTime: builder.mutation({
   query: ({ payload }) => ({
    url: "/admin/turnaround-times",
    method: "POST",
    body: payload,
   }),
   invalidatesTags: ["turnaround-time"] as any,
  }),
  editTurnaroundTime: builder.mutation({
   query: ({ id, payload }) => ({
    url: `/admin/turnaround-times/${id}`,
    method: "POST",
    body: payload,
   }),
   invalidatesTags: ["turnaround-time"] as any,
  }),
  deleteTurnaroundTime: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/turnaround-time/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["turnaround-time"] as any,
  }),
 }),
});

export const {
 useGetTurnaroundTimesQuery,
 useCreateTurnaroundTimeMutation,
 useEditTurnaroundTimeMutation,
 useDeleteTurnaroundTimeMutation,
} = turnaroundApi;
export default turnaroundApi;
