import { nodeApi } from "../nodeApi";

const fileApi = nodeApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMultipleFile: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/upload/multiple`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["file"],
    }),

    customersDocuments: builder.query({
      query: ({ page, limit }) => ({
        url: `admin/documents?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    getAllCompanies: builder.query({
      query: ({ page, limit }) => ({
        url: `admin/companies?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUploadMultipleFileMutation,
  useCustomersDocumentsQuery,
  useGetAllCompaniesQuery,
} = fileApi;
