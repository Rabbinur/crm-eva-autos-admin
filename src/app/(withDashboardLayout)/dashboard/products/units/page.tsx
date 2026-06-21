"use client";

import { Box, Edit3, Eye, Plus, Search, Trash2, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { UnitModal } from "../_components/UnitModal";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/Common/DeleteConfirmModal";
import { DetailsViewModal } from "@/components/Common/DetailsViewModal";


import {
    useGetDistributorUnitsQuery,
    useCreateDistributorUnitMutation,
    useUpdateDistributorUnitMutation,
    useDeleteDistributorUnitMutation
} from "@/components/Redux/RTK/distributorApiNode";

const UnitList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);

    const { data: units = [], isLoading } = useGetDistributorUnitsQuery();
    const [createUnit, { isLoading: isCreating }] = useCreateDistributorUnitMutation();
    const [updateUnit, { isLoading: isUpdating }] = useUpdateDistributorUnitMutation();
    const [deleteUnit] = useDeleteDistributorUnitMutation();

    const handleToggleStatus = async (unit: any) => {
        const toastId = toast.loading("Updating unit status...");
        try {
            const newStatus = unit.status === "Active" ? "Inactive" : "Active";
            await updateUnit({ id: unit.id, data: { status: newStatus } }).unwrap();
            toast.success("Unit status updated successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update unit status", { id: toastId });
        }
    };

    const filteredUnits = useMemo(() => {
        return (units || []).filter((unit: any) =>
            unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (unit.addBy && unit.addBy.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, units]);

    const handleOpenModal = (type: "add" | "edit", unit: any = null) => {
        setModalType(type);
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const handleOpenDetails = (unit: any) => {
        setSelectedDetails(unit);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleteModalOpen(false);
        const toastId = toast.loading("Deleting unit...");
        try {
            await deleteUnit(deleteId).unwrap();
            toast.success("Unit deleted successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete unit", { id: toastId });
        }
        setDeleteId(null);
    };

    const handleSaveUnit = async (name: string) => {
        const toastId = toast.loading(modalType === "add" ? "Creating unit..." : "Updating unit...");
        try {
            if (modalType === "add") {
                await createUnit({ name, status: "Active" }).unwrap();
                toast.success("Unit created successfully!", { id: toastId });
            } else {
                await updateUnit({ id: selectedUnit.id, data: { name } }).unwrap();
                toast.success("Unit updated successfully!", { id: toastId });
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save unit", { id: toastId });
        }
    };

// Removed old handleDelete function

    return (
        <div className="p-6 md:p-10 bg-[#f4f7fe] min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h1 className="text-2xl font-bold text-[#001f3f]">Unit Management</h1>
                <button
                    onClick={() => handleOpenModal("add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} /> Add Unit
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search & Entries */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Show <select className="border border-slate-200 rounded px-2 py-1 outline-none"><option>10</option></select> entries
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search unit name or added by..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-72 transition-all"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                                <th className="px-6 py-4">SL</th>
                                <th className="px-6 py-4">Add By</th>
                                <th className="px-6 py-4">Unit Details</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        Loading units...
                                    </td>
                                </tr>
                            ) : filteredUnits.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        No units found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUnits.map((unit: any, index: number) => (
                                    <tr key={unit.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                                        <td className="px-6 py-5 text-sm font-medium text-slate-300">{index + 1}</td>

                                        {/* Add By with Avatar */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <UserCircle size={22} strokeWidth={1.5} />
                                                </div>
                                                <div className="font-semibold text-slate-600">{unit.addBy || "Admin"}</div>
                                            </div>
                                        </td>

                                        {/* Unit Info with Icon */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner">
                                                    <Box size={22} className="text-blue-600" />
                                                </div>
                                                <div className="font-bold text-slate-700 leading-tight text-lg">{unit.name}</div>
                                            </div>
                                        </td>

                                        {/* Status Toggle */}
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleToggleStatus(unit)}
                                                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ease-in-out ${unit.status === "Active" ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${unit.status === "Active" ? "left-6" : "left-1"
                                                        }`} />
                                                </button>
                                            </div>
                                        </td>

                                        {/* Actions (group hover lgc) */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2  transition-all">
                                                <button onClick={() => handleOpenDetails(unit)} className="p-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 rounded-lg shadow-sm transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal("edit", unit)} className="p-2 border border-slate-100 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-lg shadow-sm transition-colors">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(unit.id)} className="p-2 border border-slate-100 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-lg shadow-sm transition-colors">
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

            <UnitModal
                key={selectedUnit?.id || (isModalOpen ? "edit" : "add")}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                data={selectedUnit}
                onSave={handleSaveUnit}
                isSaving={isCreating || isUpdating}
            />

            {/* Custom Details View Modal */}
            <DetailsViewModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Unit Details"
                fields={[
                    { label: "Unit Name", value: selectedDetails?.name },
                    { label: "Status", value: selectedDetails?.status || "Active" },
                    { label: "Added By", value: selectedDetails?.addBy || "Admin" },
                    { label: "Unit ID", value: selectedDetails?.id },
                    { label: "Created At", value: selectedDetails?.createdAt ? new Date(selectedDetails.createdAt).toLocaleString() : "N/A" },
                    { label: "Updated At", value: selectedDetails?.updatedAt ? new Date(selectedDetails.updatedAt).toLocaleString() : "N/A" },
                ]}
            />

            {/* Custom Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Unit"
                description={`Are you sure you want to delete unit "${units.find((u: any) => u.id === deleteId)?.name || ""}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default UnitList;