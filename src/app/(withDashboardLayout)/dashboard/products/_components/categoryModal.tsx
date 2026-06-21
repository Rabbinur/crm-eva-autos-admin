"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Edit3, Plus, Save, X } from "lucide-react";
import { useGetDistributorCompaniesQuery } from "@/components/Redux/RTK/distributorApiNode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CategoryData {
    id: string;
    name: string;
    company_name?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "add" | "edit";
    data: CategoryData | null;
    onSave: (name: string, company_name: string) => void;
    isSaving?: boolean;
}

export const CategoryModal = ({ isOpen, onClose, type, data, onSave, isSaving }: ModalProps) => {
    const [categoryName, setCategoryName] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");

    const { data: companies = [], isLoading: isLoadingCompanies } = useGetDistributorCompaniesQuery();

    const activeCompanies = (companies || []).filter((comp: any) => comp.status === "Active");

    useEffect(() => {
        if (type === "edit" && data) {
            setCategoryName(data.name);
            setSelectedCompany(data.company_name || "");
        } else {
            setCategoryName("");
            if (isOpen) {
                const activeComps = (companies || []).filter((comp: any) => comp.status === "Active");
                if (activeComps.length > 0) {
                    setSelectedCompany(activeComps[0].name);
                } else {
                    setSelectedCompany("");
                }
            }
        }
    }, [type, data, isOpen, companies]);

    const handleSave = () => {
        if (!selectedCompany) {
            toast.error("Please select an active company");
            return;
        }
        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }
        onSave(categoryName.trim(), selectedCompany);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        className="relative w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                        {type === "add" ? <Plus size={18} /> : <Edit3 size={18} />}
                                    </div>
                                    {type === "add" ? "Add Category" : "Edit Category"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Input Section */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">
                                        Associate Company
                                    </label>
                                    <select
                                        value={selectedCompany}
                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                        disabled={isSaving || isLoadingCompanies}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f] transition-all text-slate-700 font-medium disabled:opacity-50"
                                    >
                                        <option value="" disabled>Select a company</option>
                                        {activeCompanies.map((comp: any) => (
                                            <option key={comp.id} value={comp.name}>
                                                {comp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 ml-1">
                                        Category Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            placeholder="Enter name..."
                                            disabled={isSaving}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f] transition-all text-slate-700 font-medium disabled:opacity-50"
                                        />
                                        {categoryName.length > 0 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={onClose}
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-[#001f3f] hover:bg-black text-white rounded-xl text-sm font-bold shadow-md shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {type === "add" ? <Plus size={16} /> : <Save size={16} />}
                                        {isSaving ? "Saving..." : type === "add" ? "Create Category" : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};