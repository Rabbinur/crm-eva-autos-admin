"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import React from "react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    isLoading = false,
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
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 font-sans"
                    >
                        <div className="p-6">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                            {/* Warning Icon & Content */}
                            <div className="flex flex-col items-center text-center mt-4">
                                <div className="p-3 bg-red-50 rounded-full text-red-500 mb-4 animate-bounce">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#001f3f] mb-2">{title}</h3>
                                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-8">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? "Deleting..." : "Confirm Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
