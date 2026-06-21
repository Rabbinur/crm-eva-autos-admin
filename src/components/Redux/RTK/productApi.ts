import { laravelApi } from "../laravelApi";

const productApi = laravelApi.injectEndpoints({
 endpoints: (builder) => ({
  getProductsByCategory: builder.query({
   query: (category_id) => ({
    url: `/products/category/${category_id}`,
    method: "GET",
   }),
  }),
  getAllProducts: builder.query({
   query: ({ search }) => ({
    url: `/admin/products?search=${search}&per_page=10000&page=1`,
    method: "GET",
   }),
   providesTags: ["product"] as any,
  }),
  getProductById: builder.query({
   query: ({ id }) => ({
    url: `/admin/products/${id}`,
    method: "GET",
   }),
   providesTags: ["product"] as any,
  }),
  getProductForEditById: builder.query({
   query: ({ id }) => ({
    url: `/admin/single/product/${id}/for/edit`,
    method: "GET",
   }),
   providesTags: ["product"] as any,
  }),
  createProduct: builder.mutation({
   query: ({ data }) => ({
    url: `/admin/products`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  updateBasicProduct: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/basic`,
    method: "PATCH",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  updateProductImages: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/images/sync`,
    method: "PUT",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  updateDynamicOptions: builder.mutation({
   query: ({ data, id }) => ({
    url: `/admin/products/${id}/options`,
    method: "PATCH",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  createNewPriceCombination: builder.mutation({
   query: ({ data, id }) => ({
    url: `/admin/products/${id}/price-configs`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  updatePriceCombination: builder.mutation({
   query: ({ data, productId, configId }) => ({
    url: `/admin/products/${productId}/price-configs/${configId}`,
    method: "PUT",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deletePriceCombination: builder.mutation({
   query: ({ productId, configId }) => ({
    url: `/admin/products/${productId}/price-configs/${configId}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  updateBannerDimension: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/dimension-pricing`,
    method: "PATCH",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  addQuantityBasedPricing: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/price-ranges`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteQuantityBasedPricing: builder.mutation({
   query: ({ productId, id }) => ({
    url: `/admin/products/${productId}/price-ranges/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  addTurnaroundRange: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/turnaround-ranges`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteTurnaroundRange: builder.mutation({
   query: ({ productId, id }) => ({
    url: `/admin/products/${productId}/turnaround-ranges/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  addShippingRange: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/shipping-ranges`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteShippingRange: builder.mutation({
   query: ({ productId, id }) => ({
    url: `/admin/products/${productId}/shipping-ranges/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  addFaq: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/faqs`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  updateFaq: builder.mutation({
   query: ({ data, productId, id }) => ({
    url: `/admin/products/${productId}/faqs/${id}`,
    method: "PATCH",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteFaq: builder.mutation({
   query: ({ productId, id }) => ({
    url: `/admin/products/${productId}/faqs/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  addImage: builder.mutation({
   query: ({ data, productId }) => ({
    url: `/admin/products/${productId}/images`,
    method: "POST",
    body: data,
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteImage: builder.mutation({
   query: ({ productId, id }) => ({
    url: `/admin/products/${productId}/images/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  deleteProduct: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/product/${id}`,
    method: "DELETE",
   }),
   invalidatesTags: ["product"] as any,
  }),
  popularProducts: builder.query({
   query: () => ({
    url: `/products/popular`,
    method: "GET",
   }),
  }),
  allCategories: builder.query({
   query: () => ({
    url: `/common/products/categories`,
    method: "GET",
   }),
  }),
  categoryProducts: builder.query({
   query: (category) => ({
    url: `common/products/categoryproducts/${category}`,
    method: "GET",
   }),
  }),
  togglePopularPopular: builder.mutation({
   query: ({ id }) => ({
    url: `/admin/products/${id}/toggle-popular`,
    method: "PATCH",
   }),
  }),
 }),
});

export const {
 useGetProductsByCategoryQuery,
 useTogglePopularPopularMutation,
 usePopularProductsQuery,
 useCreateProductMutation,
 useUpdateBasicProductMutation,
 useGetAllProductsQuery,
 useDeleteProductMutation,
 useGetProductByIdQuery,
 useAllCategoriesQuery,
 useCategoryProductsQuery,
 useGetProductForEditByIdQuery,
 useUpdateDynamicOptionsMutation,
 useCreateNewPriceCombinationMutation,
 useUpdatePriceCombinationMutation,
 useDeletePriceCombinationMutation,
 useUpdateBannerDimensionMutation,
 useAddQuantityBasedPricingMutation,
 useDeleteQuantityBasedPricingMutation,
 useAddShippingRangeMutation,
 useDeleteShippingRangeMutation,
 useAddTurnaroundRangeMutation,
 useDeleteTurnaroundRangeMutation,
 useAddFaqMutation,
 useUpdateFaqMutation,
 useDeleteFaqMutation,
 useAddImageMutation,
 useDeleteImageMutation,
 useUpdateProductImagesMutation,
} = productApi;
