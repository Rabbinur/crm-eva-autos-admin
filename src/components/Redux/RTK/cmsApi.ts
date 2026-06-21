import { nodeApi } from "../nodeApi";

const cmsApi = nodeApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get footer content
    getFooter: builder.query({
      query: () => ({
        url: "/admin/cms/footer",
        method: "GET",
      }),
      providesTags: ["footer"],
    }),

    // ✅ Update footer content
    updateFooter: builder.mutation({
      query: ({ content }) => {
        return {
          url: `/admin/cms/footer`,
          method: "PATCH",
          body: content,
        };
      },
      invalidatesTags: ["footer"],
    }),
    updateLogo: builder.mutation({
      query: ({ file }: { file: File }) => {
        const formData = new FormData();
        formData.append("logo", file);
        return {
          url: `/admin/cms/footer/logo`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["footer"],
    }),
  }),
});

export const {
  useGetFooterQuery,
  useUpdateFooterMutation,
  useUpdateLogoMutation,
} = cmsApi;
