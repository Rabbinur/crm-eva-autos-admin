import { nodeApi } from "../nodeApi";

const templateApi = nodeApi.injectEndpoints({
 endpoints: (builder) => ({
  allTemplates: builder.query({
   query: (params) => ({
    url: `/admin/templates`,
    method: "GET",
    params,
   }),
   providesTags: ["Template"],
  }),

  getTemplateById: builder.query({
   query: (id) => ({
    url: `/admin/templates/${id}`,
    method: "GET",
   }),
   providesTags: ["Template"],
  }),

  deleteTemplate: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/templates/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["Template"],
  }),

  deleteTemplateFile: builder.mutation({
   query: (id) => ({
    url: `/admin/templates/groups/sizes/file-labels/files/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["Template"],
  }),

  createTemplate: builder.mutation({
   query: (data) => ({
    url: `/admin/templates`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["Template"],
  }),
  updateTemplate: builder.mutation({
   query: ({ category_name, id }) => ({
    url: `/admin/templates/${id}`,
    method: "PATCH",
    body: { category_name },
   }),
   invalidatesTags: ["Template"],
  }),

  createTemplateGroup: builder.mutation({
   query: (data) => ({
    url: `/admin/templates/groups`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["Template"],
  }),
  updateTemplateGroup: builder.mutation({
   query: ({ name, id }) => ({
    url: `/admin/templates/groups/${id}`,
    method: "PATCH",
    body: { name },
   }),
   invalidatesTags: ["Template"],
  }),
  updateTemplateFileLabel: builder.mutation({
   query: ({ title, id }) => ({
    url: `/admin/templates/groups/sizes/file-labels/${id}`,
    method: "PATCH",
    body: { title },
   }),
   invalidatesTags: ["Template"],
  }),

  createTemplateSize: builder.mutation({
   query: (data) => ({
    url: `/admin/templates/groups/sizes`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["Template"],
  }),

  updateTemplateSize: builder.mutation({
   query: ({ name, id }) => ({
    url: `/admin/templates/groups/sizes/${id}`,
    method: "PATCH",
    body: { name },
   }),
   invalidatesTags: ["Template"],
  }),

  createTemplateFileLabel: builder.mutation({
   query: (data) => ({
    url: `/admin/templates/groups/sizes/file-labels`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["Template"],
  }),

  createTemplateFilesUpload: builder.mutation({
   query: (data) => ({
    url: `/admin/templates/groups/sizes/file-labels/files`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["Template"],
  }),

  templatesCheck: builder.query({
   query: (id) => ({
    url: `/admin/templates/check-existence/${id}`,
    method: "GET",
   }),
   providesTags: ["Template"],
  }),
 }),
});

export const {
 useAllTemplatesQuery,
 useTemplatesCheckQuery,
 useGetTemplateByIdQuery,
 useCreateTemplateMutation,
 useUpdateTemplateMutation,
 useDeleteTemplateMutation,
 useCreateTemplateGroupMutation,
 useUpdateTemplateGroupMutation,
 useUpdateTemplateSizeMutation,
 useCreateTemplateSizeMutation,
 useCreateTemplateFileLabelMutation,
 useCreateTemplateFilesUploadMutation,
 useUpdateTemplateFileLabelMutation,
 useDeleteTemplateFileMutation,
} = templateApi;
