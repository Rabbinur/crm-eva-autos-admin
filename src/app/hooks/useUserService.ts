// import type { Admin } from "@/@types/admin";
// import {
//     useUserCreateMutation,
//     useUserDeleteMutation,
//     useUserListsQuery,
//     useUserUpdateMutation,
// } from "@/components/Redux/RTK/authApiNode";
// import { toast } from "sonner";

// interface UseUserServiceProps {
//     page?: number;
//     per_page?: number;
//     search?: string;
// }

// export const useUserService = ({
//     page = 1,
//     per_page = 10,
//     search = "",
// }: UseUserServiceProps) => {
//     // Fetch user list with refetch enabled on page/search change
//     const { data, isLoading, isError, refetch } = useUserListsQuery(
//         { page, per_page, search },

//     );


//     // Mutations
//     const [createUser] = useUserCreateMutation();
//     const [updateUser] = useUserUpdateMutation();
//     const [deleteUserApi] = useUserDeleteMutation();

//     // Extract data safely
//     const userList: Admin[] = data?.data?.data ?? [];
//     const totalItems: number = data?.data?.meta?.total ?? 0;
//     const perPage: number = data?.data?.meta?.limit ?? per_page;
//     const lastPage: number = Math.ceil(totalItems / perPage);

//     // Create / Update User
//     const saveUser = async (user: Partial<Admin>, onSuccess?: () => void) => {
//         try {
//             let res;
//             if (user.id) {
//                 const { id, ...updateData } = user;
//                 res = await updateUser({ id, data: updateData }).unwrap();
//             } else {
//                 res = await createUser(user).unwrap();
//             }

//             if (!res.isError) {
//                 toast.success(
//                     res.Message || (user.id ? "User updated successfully" : "User created successfully")
//                 );
//                 onSuccess?.();
//                 await refetch();
//             } else {
//                 toast.error(res.error?.errMsg || res.Message || "Operation failed");
//             }
//         } catch (error: any) {
//             toast.error(error?.data?.message || error?.message || "Something went wrong");
//         }
//     };

//     // Delete User
//     const deleteUser = async (id: number, onSuccess?: () => void) => {
//         try {
//             await deleteUserApi(id).unwrap();
//             toast.success("User deleted successfully");
//             await refetch();
//             onSuccess?.();
//         } catch (error: any) {
//             toast.error(error?.data?.message || error?.message || "Failed to delete user");
//         }
//     };

//     return {
//         userList,
//         totalItems,
//         lastPage,
//         isLoading,
//         isError,
//         saveUser,
//         deleteUser,
//         refetch,
//     };
// };

import type { Admin } from "@/@types/admin";
import {
    useUserCreateMutation,
    useUserDeleteMutation,
    useUserListsQuery,
    useUserUpdateMutation,
} from "@/components/Redux/RTK/authApiNode";
import { useMemo } from "react";
import { toast } from "sonner";

interface UseUserServiceProps {
    page?: number;
    per_page?: number;
    search?: string;
    role: string;
}

export const useUserService = ({
    role,
    page = 1,
    per_page = 10,
    search = "",
}: UseUserServiceProps) => {
    // Memoize params to avoid unnecessary refetch
    const params = useMemo(() => ({ role, page, per_page, search }), [role, page, per_page, search]);

    // console.log("🔹 Fetching page:", page, "for role:", role);

    // ✅ RTK Query automatically fetches when page/search change
    const { data, isLoading, isError, refetch } = useUserListsQuery(params, {
        skip: !role, // Skip query if role is undefined
        refetchOnMountOrArgChange: false, // Prevent double fetch
    });

    // ✅ Mutations
    const [createUser] = useUserCreateMutation();
    const [updateUser] = useUserUpdateMutation();
    const [deleteUserApi] = useUserDeleteMutation();

    // ✅ Extract data safely
    const userList: Admin[] = data?.data?.data ?? [];
    const totalItems: number = data?.data?.meta?.total ?? 0;
    const perPage: number = data?.data?.meta?.limit ?? per_page;
    const lastPage: number = Math.ceil(totalItems / perPage);

    // ✅ Save user (create/update)
    const saveUser = async (user: Partial<Admin>, onSuccess?: () => void) => {
        try {
            let res;
            if (user.id) {
                const { id, ...updateData } = user;
                res = await updateUser({ id, data: updateData }).unwrap();
            } else {
                res = await createUser(user).unwrap();
            }

            if (!res.isError) {
                toast.success(
                    res.Message || (user.id ? "User updated successfully" : "User created successfully")
                );
                onSuccess?.();
                await refetch();
            } else {
                toast.error(res.error?.errMsg || res.Message || "Operation failed");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Something went wrong");
        }
    };

    // ✅ Delete user
    const deleteUser = async (id: number, onSuccess?: () => void) => {
        try {
            await deleteUserApi(id).unwrap();
            toast.success("User deleted successfully");
            await refetch();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to delete user");
        }
    };

    return {
        userList,
        totalItems,
        lastPage,
        isLoading,
        isError,
        saveUser,
        deleteUser,
        refetch,
    };
};
