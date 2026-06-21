
import { laravelApi } from './../laravelApi';

const blogsApi = laravelApi.injectEndpoints({
    endpoints: (builder) => ({
        // CATEGORY ENDPOINTS
        createNewCategory: builder.mutation({
            query: (data: any) => ({
                url: "/admin/blogs/categories",
                method: "POST",
                body: data,
            }),

        }),
        getCategoriesList: builder.query({
            query: () => ({
                url: "/admin/blogs/categories/all/list",
                method: "GET",
            }),

        }),

        getAllCategories: builder.query({
            query: () => ({
                url: "/admin/blogs/categories",
                method: "GET",
            }),

        }),

        deleteCategory: builder.mutation({
            query: (id: string) => ({
                url: `/admin/blogs/categories/${id}`,
                method: "DELETE",
            }),

        }),
        updateCategory: builder.mutation({
            query: ({ id, updateData }: { id: string; updateData: any }) => ({
                url: `/admin/blogs/categories/${id}`,
                method: "PUT", // Usually it's PUT or PATCH for updates
                body: updateData,
            }),

        }),

        // ARTICLE ENDPOINTS
        createNewArticle: builder.mutation({
            query: ({ data }) => ({
                url: "/admin/blogs/articles",
                method: "POST",
                body: data,
            }),

        }),
        getAllArticles: builder.query({
            query: (params: any) => ({
                url: "/admin/blogs/articles",
                method: "GET",
                params,
            }),

        }),
        getSingleArticle: builder.query({
            query: (id: string) => ({
                url: `/admin/blogs/articles/${id}`,
                method: "GET",
            }),

        }),
        deleteArticle: builder.mutation({
            query: (id: any) => ({
                url: `/admin/blogs/articles/${id}`,
                method: "DELETE",
            }),

        }),
        updateArticle: builder.mutation({
            query: ({ id, updateData }: { id: string; updateData: any }) => ({
                url: `/admin/blogs/articles/${id}`,
                method: "PUT", // or PATCH
                body: updateData,
            }),

        }),


        updateBlog: builder.mutation({
            query: ({ id, updateData }: { id: string; updateData: any }) => ({
                url: `/admin/blogs/articles/${id}`,
                method: "POST",
                body: updateData,
            }),

        }),
    }),
});

export const {
    useCreateNewCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoriesListQuery,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,

    useCreateNewArticleMutation,
    useGetAllArticlesQuery,
    useGetSingleArticleQuery,
    useDeleteArticleMutation,
    useUpdateArticleMutation,

    useUpdateBlogMutation,
} = blogsApi;
