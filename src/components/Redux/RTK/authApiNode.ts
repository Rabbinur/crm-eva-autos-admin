import type { Admin } from "@/@types/admin";

import { nodeApi } from "../nodeApi";

export const authApiNode = nodeApi.injectEndpoints({
    endpoints: (builder) => ({



        // ✅ User list (GET)
        userLists: builder.query({
            query: ({ role, page, per_page = 1, search = "" }: { role?: string, page?: number, per_page?: number; search?: string }) => ({
                url: `/admin/users?search_query=${search}&page=${page}&limit=${per_page}${role ? `&role=${role}` : ""}`,
                method: "GET",
            }),
        }),

        // ✅ user create (POST)
        userCreate: builder.mutation<Admin, Partial<Admin>>({
            query: (data) => ({
                url: "/admin/users",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),

        // ✅ User update (PATCH)
        userUpdate: builder.mutation<Admin, { id: number; data: Partial<Admin> }>({
         
            query: ({ id, data }) => ({

                url: `/admin/users/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),
        // ✅ Admin delete (DELETE)
        userDelete: builder.mutation({
            query: (id: number) => ({
                url: `/admin/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),

        // ✅ Verify OTP
        verifyAdminOTP: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/verify",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),

        // ✅ Resend OTP
        resendAdminOTP: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/resend-otp",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {

    useUserListsQuery,
    useUserCreateMutation,
    useUserUpdateMutation,
    useUserDeleteMutation,
    useVerifyAdminOTPMutation,
    useResendAdminOTPMutation,

} = authApiNode;
