// src/hooks/useAdminService.ts
import { Admin } from "@/@types/admin";
import {
  useUserCreateMutation,
  useUserDeleteMutation,
  useUserListsQuery,
  useUserUpdateMutation,
} from "@/components/Redux/RTK/authApiNode";
import { useMemo } from "react";
import { toast } from "sonner";

interface UseAdminServiceProps {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}

export const useAdminService = ({
  role,
  page = 1,
  per_page = 10,
  search = "",
}: UseAdminServiceProps) => {
  // Memoize params to avoid unnecessary refetch
  const params = useMemo(() => ({ role, page, per_page, search }), [role, page, per_page, search]);

  const { data, isLoading, isError, refetch, isFetching } = useUserListsQuery(params, {
    skip: !role, // Skip query if role is undefined
    refetchOnMountOrArgChange: false, // Prevent double fetch
  });

  const adminList: Admin[] = data?.data?.data || [];
  const totalItems: number = data?.data?.meta?.total || 0;
  const limit: number = data?.data?.meta?.limit || per_page;
  const lastPage: number = Math.ceil(totalItems / limit) || 1;

  // Mutations
  const [createAdmin, { isLoading: isCreating }] = useUserCreateMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUserUpdateMutation();
  const [deleteAdminApi, { isLoading: isDeleting }] = useUserDeleteMutation();

  const saveAdmin = async (admin: Partial<Admin>, onSuccess?: () => void) => {
    try {
      let res;
      if (admin.id) {
        const { id, ...updateData } = admin;
        res = await updateAdmin({ id, data: updateData }).unwrap();
      } else {
        res = await createAdmin(admin).unwrap();
      }

      if (res.success || !res.isError) {
        toast.success(res.message || res.Message || (admin.id ? "User updated successfully" : "User created successfully"));
        onSuccess?.();
        await refetch(); // refresh current page
      } else {
        toast.error(res.error?.errMsg || res.message || res.Message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
      console.error("❌ Failed to save admin:", error);
    }
  };

  const deleteAdmin = async (id: number, onSuccess?: () => void) => {
    try {
      await deleteAdminApi(id).unwrap();
      toast.success("User deleted successfully");
      await refetch(); // refresh current page
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to delete user");
      console.error("❌ Failed to delete admin:", error);
    }
  };

  return {
    adminList,
    totalItems,
    lastPage,
    isLoading: isLoading || isFetching,
    isError,
    isCreating,
    isUpdating,
    isDeleting,
    saveAdmin,
    deleteAdmin,
    refetch,
  };
};
