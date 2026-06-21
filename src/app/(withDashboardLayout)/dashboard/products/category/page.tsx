

"use client";

import { Edit3, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryModal } from "../_components/categoryModal";
import { toast } from "sonner";
import {
    useGetDistributorCategoriesQuery,
    useCreateDistributorCategoryMutation,
    useUpdateDistributorCategoryMutation,
    useDeleteDistributorCategoryMutation,
    useGetDistributorCompaniesQuery
} from "@/components/Redux/RTK/distributorApiNode";
import { DeleteConfirmModal } from "@/components/Common/DeleteConfirmModal";
import { DetailsViewModal } from "@/components/Common/DetailsViewModal";

const CategoryList = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");

    const queryParams = useMemo(() => {
        return {
            company_name: selectedCompanyFilter === "All" ? undefined : selectedCompanyFilter,
            search_query: searchTerm.trim() || undefined,
        };
    }, [selectedCompanyFilter, searchTerm]);

    const { data: categories = [], isLoading } = useGetDistributorCategoriesQuery(queryParams);
    const { data: companies = [] } = useGetDistributorCompaniesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateDistributorCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateDistributorCategoryMutation();
    const [deleteCategory] = useDeleteDistributorCategoryMutation();

    const activeCompaniesFilter = useMemo(() => {
        return (companies || []).filter((comp: any) => comp.status === "Active");
    }, [companies]);

    const handleToggleStatus = async (cat: any) => {
        const toastId = toast.loading("Updating category status...");
        try {
            const newStatus = cat.status === "Active" ? "Inactive" : "Active";
            await updateCategory({ id: cat.id, data: { status: newStatus } }).unwrap();
            toast.success("Category status updated successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update category status", { id: toastId });
        }
    };

    const filteredCategories = categories;


    // মোডাল হ্যান্ডলার
    const handleOpenModal = (type: "add" | "edit", category: any = null) => {
        setModalType(type);
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleOpenDetails = (category: any) => {
        setSelectedDetails(category);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleteModalOpen(false);
        const toastId = toast.loading("Deleting category...");
        try {
            await deleteCategory(deleteId).unwrap();
            toast.success("Category deleted successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete category", { id: toastId });
        }
        setDeleteId(null);
    };

    const handleSaveCategory = async (name: string, company_name: string) => {
        const toastId = toast.loading(modalType === "add" ? "Creating category..." : "Updating category...");
        try {
            if (modalType === "add") {
                await createCategory({ name, company_name, status: "Active" }).unwrap();
                toast.success("Category created successfully!", { id: toastId });
            } else {
                await updateCategory({ id: selectedCategory.id, data: { name, company_name } }).unwrap();
                toast.success("Category updated successfully!", { id: toastId });
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save category", { id: toastId });
        }
    };

// Removed old handleDelete function

    return (
        <div className="p-6 md:p-10 bg-[#f4f7fe] min-h-screen">
            {/* হেডার */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h1 className="text-2xl font-bold text-[#001f3f]">Category List</h1>
                <button
                    onClick={() => handleOpenModal("add")}
                    className="bg-[#001f3f] hover:bg-black text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md shadow-slate-200"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Category
                </button>
            </div>

            {/* টেবিল */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* সার্চ বার ও ফিল্টার */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Show
                        <select className="border border-slate-200 rounded px-2 py-1 outline-none mx-1">
                            <option>10</option>
                            <option>25</option>
                        </select>
                        entries
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                        {/* Company Filter Dropdown */}
                        <select
                            value={selectedCompanyFilter}
                            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#001f3f]/10 outline-none text-slate-600 font-medium"
                        >
                            <option value="All">All Companies</option>
                            {activeCompaniesFilter.map((comp: any) => (
                                <option key={comp.id} value={comp.name}>
                                    {comp.name}
                                </option>
                            ))}
                        </select>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search Category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#001f3f]/10 outline-none w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* মেইন টেবিল */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                                <th className="px-6 py-4">SL</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Associated Company</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat: any, index: number) => (
                                    <tr
                                        key={cat.id}
                                        className="group hover:bg-[#001f3f]/5 hover:shadow-[inset_4px_0_0_0_#001f3f] transition-all duration-200"
                                    >
                                        <td className="px-6 py-5 text-sm font-medium text-slate-300">{index + 1}</td>
                                        <td className="px-6 py-5 font-bold text-slate-700">{cat.name}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-500">{cat.company_name || "N/A"}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleToggleStatus(cat)}
                                                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ease-in-out ${cat.status === "Active" ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${cat.status === "Active" ? "left-6" : "left-1"
                                                        }`} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <button onClick={() => handleOpenDetails(cat)} className="p-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 rounded-lg shadow-sm">
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal("edit", cat)}
                                                    className="p-2 border border-slate-100 bg-white hover:bg-[#001f3f]/10 hover:text-[#001f3f] text-slate-400 rounded-lg shadow-sm"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat.id)}
                                                    className="p-2 border border-slate-100 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-lg shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* মোডাল কল */}
            <CategoryModal
                key={selectedCategory?.id || (isModalOpen ? "edit" : "add")}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                data={selectedCategory}
                onSave={handleSaveCategory}
                isSaving={isCreating || isUpdating}
            />

            {/* Custom Details View Modal */}
            <DetailsViewModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Category Details"
                fields={[
                    { label: "Category Name", value: selectedDetails?.name },
                    { label: "Associated Company", value: selectedDetails?.company_name || "N/A" },
                    { label: "Status", value: selectedDetails?.status || "Active" },
                    { label: "Category ID", value: selectedDetails?.id },
                    { label: "Created At", value: selectedDetails?.createdAt ? new Date(selectedDetails.createdAt).toLocaleString() : "N/A" },
                    { label: "Updated At", value: selectedDetails?.updatedAt ? new Date(selectedDetails.updatedAt).toLocaleString() : "N/A" },
                ]}
            />

            {/* Custom Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                description={`Are you sure you want to delete category "${categories.find((c: any) => c.id === deleteId)?.name || ""}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CategoryList;