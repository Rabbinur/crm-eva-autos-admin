"use client";

import { Admin } from "@/@types/admin";
import { useUserService } from "@/app/hooks/useUserService";
import ConfirmModal from "@/components/Common/confirmModal";
import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AdminModal from "../admin-management/_component/AdminModal";
import AdminTable from "../admin-management/_component/AdminTable";


export default function CustomerManagement() {
    const role = "client";
    const per_page = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<Admin | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const { userList, totalItems, lastPage, saveUser, deleteUser, isLoading, isError } =
        useUserService({ role, page: currentPage, per_page, search });

    console.log("userList", userList);

    // Reset page to 1 only if search or role changes
    useEffect(() => {
        setCurrentPage(1);
    }, [role, search]);

    // Pagination
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage && page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Search
    const handleSearchChange = (val: string) => {
        setSearch(val);
    };

    // Delete
    const handleDelete = async () => {
        if (!selectedUser) return;
        await deleteUser(selectedUser.id, () => setDeleteModalOpen(false));
    };

    // Create/update
    const handleSubmit = async (formData: Partial<Admin>) => {
        await saveUser({ id: selectedUser?.id, ...formData }, () => setUserModalOpen(false));
    };


    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs md:text-sm">
                <Home size={18} />
                <ChevronRight size={16} />
                <span className="text-red-600">Dashboard</span>
                <ChevronRight size={16} />
                <span className="text-muted-foreground capitalize">{role === "client" ? "Customer" : "Client"} Management</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold capitalize">{role === "client" ? "Customer" : "Client"
                    } Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your {role === "client" ? "Customer" : "Client"
                    }s</p>
                </div>
                <Button
                    className="gap-2 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                        setSelectedUser(null);
                        setUserModalOpen(true);
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Add {role}
                </Button>
            </div>

            {/* Table */}
            <AdminTable
                data={userList}
                per_page={per_page}
                totalItems={totalItems}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onEdit={(user) => {
                    setSelectedUser(user);
                    setUserModalOpen(true);
                }}
                onDelete={(user) => {
                    setSelectedUser(user);
                    setDeleteModalOpen(true);
                }}
                onSearchChange={handleSearchChange}
                isLoading={isLoading}
                isError={isError}
            />


            {/* Delete Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                title={`Delete ${role}`}
                description={`Are you sure you want to delete "${selectedUser?.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />

            {/* Add / Edit Modal */}
            <AdminModal
                open={userModalOpen}
                initialData={selectedUser ?? undefined}
                onClose={() => setUserModalOpen(false)}
                onSubmit={handleSubmit}
                defaultRole="client"
            />
        </div>
    );
}
