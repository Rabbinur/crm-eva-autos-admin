import { laravelApi } from "../laravelApi";

const categoriesApi = laravelApi.injectEndpoints({
 endpoints: (builder) => ({
  getCategories: builder.query({
   query: () => ({
    url: "/categories",
    method: "GET",
   }),
   providesTags: ["category"] as any,
  }),
  getCategoriesForAdmin: builder.query({
   query: () => ({
    url: "/admin/categories",
    method: "GET",
   }),
   providesTags: ["category"] as any,
  }),
  getParentCategories: builder.query({
   query: (params) => ({
    url: "/categories/parent",
    method: "GET",
    params: params,
   }),
   providesTags: ["category"] as any,
  }),
  getCategoryOrSubcategoryById: builder.query({
   query: (params) => ({
    url: `/admin/categories/${params.id}`,
    method: "GET",
   }),
   providesTags: ["category"] as any,
  }),
  createCategory: builder.mutation({
   query: ({ payload }) => ({
    url: "/admin/categories",
    method: "POST",
    body: payload,
   }),
   invalidatesTags: ["category"] as any,
  }),
  editCategory: builder.mutation({
   query: ({ id, payload }) => ({
    url: `admin/categories/${id}`,
    method: "POST",
    body: payload,
   }),
   invalidatesTags: ["category"] as any,
  }),
  deleteCategory: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/categories/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["category"] as any,
  }),
  showInNavbar: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/categories/${id}/toggle-navbar`,
    method: "PATCH",
   }),
   invalidatesTags: ["category"] as any,
  }),
  navbarCategories: builder.query({
   query: () => ({
    url: "/categories/navbar",
    method: "GET",
   }),
   providesTags: ["category"] as any,
  }),
 }),
});

export const {
 useGetCategoriesQuery,
 useGetCategoriesForAdminQuery,
 useGetCategoryOrSubcategoryByIdQuery,
 useCreateCategoryMutation,
 useDeleteCategoryMutation,
 useEditCategoryMutation,
 useShowInNavbarMutation,
 useNavbarCategoriesQuery,
 useGetParentCategoriesQuery,
} = categoriesApi;
export default categoriesApi;
