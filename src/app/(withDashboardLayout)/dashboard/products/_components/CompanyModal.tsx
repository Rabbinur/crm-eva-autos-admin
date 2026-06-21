
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Edit3, Image as ImageIcon, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "add" | "edit";
    data: any | null;
    onSave: (data: { name: string; contact?: string; address?: string; logo?: string | null }) => void;
    isSaving?: boolean;
}

export const CompanyModal = ({ isOpen, onClose, type, data, onSave, isSaving }: ModalProps) => {
    const [formData, setFormData] = useState({ name: "", contact: "", address: "" });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (type === "edit" && data) {
            setFormData({ name: data.name || "", contact: data.contact || "", address: data.address || "" });
            setImagePreview(data.logo || null);
        } else {
            setFormData({ name: "", contact: "", address: "" });
            setImagePreview(null);
        }
    }, [type, data, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            toast.error("Company name is required");
            return;
        }
        onSave({ ...formData, logo: imagePreview });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />

                    <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden font-sans">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        {type === "add" ? <Building2 size={20} /> : <Edit3 size={20} />}
                                    </div>
                                    {type === "add" ? "Register Company" : "Update Company"}
                                </h2>
                                <button onClick={onClose} disabled={isSaving} className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"><X size={20} /></button>
                            </div>

                            <div className="space-y-4">

                                {/* Meaningful Logo Section */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="relative shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Logo" className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-sm" />
                                        ) : (
                                            <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-300">
                                                <ImageIcon size={24} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Logo</span>
                                        <div className="flex items-center gap-2">
                                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" disabled={isSaving} />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isSaving}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {imagePreview ? <RefreshCw size={14} /> : <Plus size={14} />}
                                                {imagePreview ? "Change Logo" : "Upload Logo"}
                                            </button>
                                            {imagePreview && (
                                                <button
                                                    onClick={removeImage}
                                                    disabled={isSaving}
                                                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Company Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Company Name *</label>
                                        <div className="relative">
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter company name" disabled={isSaving} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700 disabled:opacity-50" />
                                            {formData.name.length > 2 && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                        </div>
                                    </div>  {/* Contact Number */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Contact Number</label>
                                        <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="e.g. 01712..." disabled={isSaving} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700 disabled:opacity-50" />
                                    </div>

                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Address */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Office Address</label>
                                        <textarea rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full address details..." disabled={isSaving} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700 resize-none disabled:opacity-50" />
                                    </div>
                                    {/* Status indicator */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Account Status</label>
                                        <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active (Default)
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-4">
                                    <button onClick={onClose} disabled={isSaving} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">Cancel</button>
                                    <button onClick={handleSave} disabled={isSaving} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50">
                                        {type === "add" ? <Plus size={16} strokeWidth={3} /> : <Save size={16} />}
                                        {isSaving ? "Saving..." : type === "add" ? "Create Company" : "Save Changes"}
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