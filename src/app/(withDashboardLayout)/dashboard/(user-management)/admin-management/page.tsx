"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Admin } from "@/@types/admin";
import { useAdminService } from "@/app/hooks/useAdminService";
import ConfirmModal from "@/components/Common/confirmModal";
import { useAppSelector } from "@/components/Redux/hooks";
import { useCurrentUserInfo } from "@/components/Redux/Slice/authSlice";
import { useSearchParams } from "next/navigation";
import AdminModal from "./_component/AdminModal";
import AdminTable from "./_component/AdminTable";

export default function AdminManagement() {
  const user = useAppSelector(useCurrentUserInfo);
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = roleParam ?? "admin"; // stable primitive

  const per_page = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Block moderator access
  if (user?.role === "moderator") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-3xl font-extrabold text-red-600">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You do not have permission to view or manage users on this platform.
        </p>
      </div>
    );
  }

  // ✅ UseAdminService with stable primitives
  const { adminList, totalItems, lastPage, isLoading, isError, saveAdmin, deleteAdmin } =
    useAdminService({
      role,
      page: currentPage,
      per_page,
      search,
    });
  console.log("adminList", adminList)
  // ✅ Reset to first page if role or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [role, search]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  // const handleSubmit = async (formData: Partial<Admin>) => {
  //   if (!formData && !selectedAdmin) return;
  //   await saveAdmin(
  //     { ...selectedAdmin, ...formData },
  //     () => setAdminModalOpen(false)
  //   );
  // };
  const handleSubmit = async (formData: Partial<Admin>) => {
    console.log("selectedAdmin", selectedAdmin);
    console.log("formData", formData);

    const payload = selectedAdmin
      ? {
        id: selectedAdmin.id,
        ...formData,
      }
      : formData;

    await saveAdmin(
      payload,
      () => setAdminModalOpen(false)
    );
  };
  const handleDelete = async () => {
    if (!selectedAdmin) return;
    await deleteAdmin(selectedAdmin.id, () => setDeleteModalOpen(false));
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs md:text-sm">
        <Home size={18} />
        <ChevronRight size={16} />
        <span className="text-red-600">Dashboard</span>
        <ChevronRight size={16} />
        <span className="text-muted-foreground">{role} Management</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">{role} Management</h1>
          <p className="text-muted-foreground mt-1">Manage your {role}s</p>
        </div>
        <Button
          className="gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => {
            setSelectedAdmin(null);
            setAdminModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add {role}
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        data={adminList}
        totalItems={totalItems}
        currentPage={currentPage}
        per_page={per_page}
        onPageChange={handlePageChange}
        onEdit={(admin) => {
          setSelectedAdmin(admin);
          setAdminModalOpen(true);
        }}
        onDelete={(admin) => {
          setSelectedAdmin(admin);
          setDeleteModalOpen(true);
        }}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Modals */}
      <ConfirmModal
        open={deleteModalOpen}
        title={`Delete ${role}`}
        description={`Are you sure you want to delete "${selectedAdmin?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <AdminModal
        open={adminModalOpen}
        initialData={selectedAdmin ?? undefined}
        onClose={() => setAdminModalOpen(false)}
        onSubmit={handleSubmit}
        defaultRole={role as "admin" | "moderator"}
      />
    </div>
  );
}
