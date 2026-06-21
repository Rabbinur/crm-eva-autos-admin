"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Box, CheckCircle2, Edit3, FileText, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "add" | "edit";
    data: any | null;
    onSave: (name: string) => void;
    isSaving?: boolean;
}

export const UnitModal = ({ isOpen, onClose, type, data, onSave, isSaving }: ModalProps) => {
    const [unitName, setUnitName] = useState("");

    useEffect(() => {
        if (type === "edit" && data) {
            setUnitName(data.name || "");
        } else {
            setUnitName("");
        }
    }, [type, data, isOpen]);

    const handleSave = () => {
        if (!unitName.trim()) {
            toast.error("Unit name is required");
            return;
        }
        onSave(unitName);
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

                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden font-sans"
                    >
                        <div className="p-6">
                            {/* Header - Same as Company Modal */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        {type === "add" ? <Box size={20} /> : <Edit3 size={20} />}
                                    </div>
                                    {type === "add" ? "Register Unit" : "Update Unit"}
                                </h2>
                                <button onClick={onClose} disabled={isSaving} className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">

                                {/* Meaningful Unit Preview Section - Matches Company Logo Style */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-blue-500 shadow-sm">
                                            <span className="text-2xl font-black uppercase">
                                                {unitName ? unitName.substring(0, 3) : <Box size={24} strokeWidth={1.5} className="text-slate-300" />}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Identity</span>
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 flex items-center gap-1.5 shadow-sm">
                                                <FileText size={14} className="text-blue-500" />
                                                Measurement Unit
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Unit Name Input - Same Font and Style as Company Name */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Unit Name *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={unitName}
                                            onChange={(e) => setUnitName(e.target.value.toUpperCase())}
                                            placeholder="e.g. KG, PCS, LTR"
                                            disabled={isSaving}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700 disabled:opacity-50"
                                        />
                                        {unitName.length > 0 && (
                                            <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Static Status Indicator - Matches Company Modal Style */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Account Status</label>
                                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active (Default)
                                    </div>
                                </div>

                                {/* Actions - Same as Company Modal */}
                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        onClick={onClose}
                                        disabled={isSaving}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-[2] flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {type === "add" ? <Plus size={16} strokeWidth={3} /> : <Save size={16} />}
                                        {isSaving ? "Saving..." : type === "add" ? "Create Unit" : "Save Changes"}
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