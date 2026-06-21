"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

interface DetailField {
    label: string;
    value: React.ReactNode;
}

interface DetailsViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: DetailField[];
    logoUrl?: string;
}

export const DetailsViewModal: React.FC<DetailsViewModalProps> = ({
    isOpen,
    onClose,
    title,
    fields,
    logoUrl,
}) => {
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
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.96, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 font-sans"
                    >
                        {/* Header Banner */}
                        <div className="bg-[#001f3f] px-6 py-5 text-white flex items-center justify-between">
                            <h3 className="text-lg font-bold">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-white/75 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 ">
                            {logoUrl && (
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 grid grid-cols-3 gap-5">
                                {fields.map((field, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                                            {field.label}
                                        </span>
                                        <div className="text-sm font-semibold text-slate-700">
                                            {field.value || "N/A"}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Action */}
                            <div className="mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
