import { nodeApi } from "../nodeApi";

const bannerApi = nodeApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all banners
    allBanners: builder.query({
      query: () => ({
        url: "/admin/banners",
        method: "GET",
      }),
      providesTags: ["banner"],
    }),

    // ✅ Get single banner by ID
    getBannerById: builder.query({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "GET",
      }),
      providesTags: ["banner"],
    }),

    // ✅ Create banner
    createBanner: builder.mutation({
      query: ({ title, image, position, type }) => {
        const formData = new FormData();
        if (title) formData.append("title", title);
        if (image) formData.append("image", image);
        if (position !== undefined) formData.append("position", position);
        if (type) formData.append("type", type);

        return {
          url: "/admin/banners",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["banner"],
    }),

    // ✅ Update banner (PATCH)
    updateBanner: builder.mutation({
      query: ({ id, title, image, position, type }) => {
        const formData = new FormData();
        if (title) formData.append("title", title);
        if (image) formData.append("image", image);
        if (position !== undefined) formData.append("position", position);
        if (type) formData.append("type", type);

        return {
          url: `/admin/banners/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["banner"],
    }),

    // ✅ Delete banner
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
