import type { Admin } from "@/@types/admin";
import { laravelApi } from "../laravelApi";

export const authApi = laravelApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Verify OTP
    verifyOTP: builder.mutation<any, any>({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Resend OTP
    resendVerifyOTP: builder.mutation<any, any>({
      query: (data) => ({
        url: "/resend/otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Profile Update (Common)
    updateProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/admin/me",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Change Password
    changePassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/admin/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Auth Check
    authCheck: builder.query<any, void>({
      query: () => ({
        url: "/auth/authcheck",
        method: "GET",
      }),
    }),

    // ✅ My Profile
    myProfile: builder.query<any, void>({
      query: () => ({
        url: "/auth/admin/me",
        method: "GET",
      }),
    }),

    // ✅ Send password reset email
    sendPasswordResetEmail: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/password/email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Reset password
    sendResetPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/user/password/reset",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Admin list (GET)
    adminList: builder.query({
      query: ({ role, page, per_page = 1, search = "" }: { role?: any, page?: number, per_page?: number; search?: string }) => ({
        url: `/admin/user?role=${role}&page=${page}&per_page=${per_page}&search=${search}`,
        method: "GET",
      }),
    }),

    // ✅ Admin create (POST)
    adminCreate: builder.mutation<Admin, Partial<Admin>>({
      query: (data) => ({
        url: "/admin/user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // ✅ Admin update (POST)
    adminUpdate: builder.mutation<Admin, { id: number; data: Partial<Admin> }>({
      query: ({ id, data }) => ({

        url: `/admin/user/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    // ✅ Admin delete (DELETE)
    adminDelete: builder.mutation({
      query: (id: number) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useVerifyOTPMutation,
  useResendVerifyOTPMutation,
  useSendPasswordResetEmailMutation,
  useSendResetPasswordMutation,
  useChangePasswordMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useAdminListQuery,
  useAdminCreateMutation,
  useAdminUpdateMutation,
  useAdminDeleteMutation,
  useAuthCheckQuery,
} = authApi;
