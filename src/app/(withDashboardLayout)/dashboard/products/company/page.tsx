

// "use client";

// import { Edit3, Eye, Plus, Search, Trash2, Phone, MapPin } from "lucide-react";
// import { useState, useMemo } from "react";
// import { CompanyModal } from "../_components/CompanyModal";


// const CompanyList = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<"add" | "edit">("add");
//   const [selectedCompany, setSelectedCompany] = useState<any>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // ১. কোম্পানির ডেটাকে স্টেটে নিয়ে আসা যাতে টগল করলে আপডেট হয়
//   const [companies, setCompanies] = useState([
//     { id: 1, name: "Good Foods Co.", contact: "01712345678", address: "Rupnagar Residential Area", status: "Active" },
//     { id: 2, name: "SweetBite Ltd.", contact: "01822334455", address: "Dhaka, Bangladesh", status: "Active" },
//     { id: 3, name: "CleanCare BD", contact: "01911223344", address: "Gulshan-2, Dhaka", status: "Inactive" },
//   ]);

//   // ২. টগল হ্যান্ডলার ফাংশন
//   const handleToggleStatus = (id: number) => {
//     setCompanies((prev) =>
//       prev.map((company) =>
//         company.id === id
//           ? { ...company, status: company.status === "Active" ? "Inactive" : "Active" }
//           : company
//       )
//     );
//   };

//   const filteredCompanies = useMemo(() => {
//     return companies.filter((comp) =>
//       comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       comp.contact.includes(searchTerm)
//     );
//   }, [searchTerm, companies]);

//   const handleOpenModal = (type: "add" | "edit", company: any = null) => {
//     setModalType(type);
//     setSelectedCompany(company);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-6 md:p-10 bg-[#f4f7fe] min-h-screen font-sans">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
//         <h1 className="text-2xl font-bold text-[#001f3f]">Company Management</h1>
//         <button
//           onClick={() => handleOpenModal("add")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
//         >
//           <Plus size={18} strokeWidth={3} /> Add Company
//         </button>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
//             Show <select className="border border-slate-200 rounded px-2 py-1 outline-none"><option>10</option></select> entries
//           </div>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search company or contact..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-72"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
//                 <th className="px-6 py-4">SL</th>
//                 <th className="px-6 py-4">Company Info</th>
//                 <th className="px-6 py-4">Address</th>
//                 <th className="px-6 py-4 text-center">Status</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredCompanies.map((comp, index) => (
//                 <tr key={comp.id} className="group hover:bg-blue-50/30 transition-all duration-200">
//                   <td className="px-6 py-5 text-sm font-medium text-slate-300">{index + 1}</td>
//                   <td className="px-6 py-5">
//                     <div className="font-bold text-slate-700">{comp.name}</div>
//                     <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
//                       <Phone size={10} /> {comp.contact}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="text-sm text-slate-500 flex items-center gap-1.5 font-medium leading-tight">
//                       <MapPin size={14} className="text-slate-300" /> {comp.address}
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex justify-center">
//                       {/* ৩. ফাংশনাল টগল বাটন */}
//                       <button 
//                         onClick={() => handleToggleStatus(comp.id)}
//                         className={`w-11 h-6 rounded-full relative transition-all duration-300 ease-in-out ${
//                           comp.status === "Active" ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
//                         }`}
//                       >
//                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
//                           comp.status === "Active" ? "left-6" : "left-1"
//                         }`} />
//                       </button>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center justify-end gap-2 transition-all">
//                       <button className="p-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 rounded-lg">
//                         <Eye size={16} />
//                       </button>
//                       <button onClick={() => handleOpenModal("edit", comp)} className="p-2 border border-slate-100 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-lg">
//                         <Edit3 size={16} />
//                       </button>
//                       <button className="p-2 border border-slate-100 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-lg">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <CompanyModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         type={modalType}
//         data={selectedCompany}
//       />
//     </div>
//   );
// };

// export default CompanyList;


"use client";

import { Edit3, Eye, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CompanyModal } from "../_components/CompanyModal";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/Common/DeleteConfirmModal";
import { DetailsViewModal } from "@/components/Common/DetailsViewModal";
import {
    useGetDistributorCompaniesQuery,
    useCreateDistributorCompanyMutation,
    useUpdateDistributorCompanyMutation,
    useDeleteDistributorCompanyMutation
} from "@/components/Redux/RTK/distributorApiNode";

const CompanyList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);

    const { data: companies = [], isLoading } = useGetDistributorCompaniesQuery();
    const [createCompany, { isLoading: isCreating }] = useCreateDistributorCompanyMutation();
    const [updateCompany, { isLoading: isUpdating }] = useUpdateDistributorCompanyMutation();
    const [deleteCompany] = useDeleteDistributorCompanyMutation();

    const handleToggleStatus = async (comp: any) => {
        const toastId = toast.loading("Updating company status...");
        try {
            const newStatus = comp.status === "Active" ? "Inactive" : "Active";
            await updateCompany({ id: comp.id, data: { status: newStatus } }).unwrap();
            toast.success("Company status updated successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update company status", { id: toastId });
        }
    };

    const filteredCompanies = useMemo(() => {
        return (companies || []).filter((comp: any) =>
            comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (comp.contact && comp.contact.includes(searchTerm))
        );
    }, [searchTerm, companies]);

    const handleOpenModal = (type: "add" | "edit", company: any = null) => {
        setModalType(type);
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleOpenDetails = (company: any) => {
        setSelectedDetails(company);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleteModalOpen(false);
        const toastId = toast.loading("Deleting company...");
        try {
            await deleteCompany(deleteId).unwrap();
            toast.success("Company deleted successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete company", { id: toastId });
        }
        setDeleteId(null);
    };

    const handleSaveCompany = async (companyData: any) => {
        const toastId = toast.loading(modalType === "add" ? "Adding company..." : "Updating company...");
        try {
            if (modalType === "add") {
                await createCompany({ ...companyData, status: "Active" }).unwrap();
                toast.success("Company added successfully!", { id: toastId });
            } else {
                await updateCompany({ id: selectedCompany.id, data: companyData }).unwrap();
                toast.success("Company updated successfully!", { id: toastId });
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save company", { id: toastId });
        }
    };

// Removed old handleDelete function

    return (
        <div className="p-6 md:p-10 bg-[#f4f7fe] min-h-screen font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h1 className="text-2xl font-bold text-[#001f3f]">Company Management</h1>
                <button
                    onClick={() => handleOpenModal("add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} /> Add Company
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Show <select className="border border-slate-200 rounded px-2 py-1 outline-none"><option>10</option></select> entries
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search company or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full md:w-72"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                                <th className="px-6 py-4">SL</th>
                                <th className="px-6 py-4">Company Info</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        Loading companies...
                                    </td>
                                </tr>
                            ) : filteredCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                        No companies found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((comp: any, index: number) => (
                                    <tr key={comp.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                                        <td className="px-6 py-5 text-sm font-medium text-slate-300">{index + 1}</td>

                                        {/* Company Info with Logo */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                {/* Logo Avatar */}
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                                    {comp.logo ? (
                                                        <img src={comp.logo} alt="logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-blue-600 font-black text-sm uppercase">
                                                            {comp.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="font-bold text-slate-700 leading-tight">{comp.name}</div>
                                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold uppercase tracking-tight">
                                                        <Phone size={10} className="text-slate-300" /> {comp.contact || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="text-sm text-slate-500 flex items-center gap-1.5 font-medium leading-tight">
                                                <MapPin size={14} className="text-slate-300 shrink-0" />
                                                <span className="truncate max-w-[200px]">{comp.address || "N/A"}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleToggleStatus(comp)}
                                                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ease-in-out ${comp.status === "Active" ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
                                                        }`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${comp.status === "Active" ? "left-6" : "left-1"
                                                        }`} />
                                                </button>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenDetails(comp)} className="p-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleOpenModal("edit", comp)} className="p-2 border border-slate-100 bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-lg transition-colors">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(comp.id)} className="p-2 border border-slate-100 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-lg transition-colors">
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

            <CompanyModal
                key={selectedCompany?.id || (isModalOpen ? "edit" : "add")}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                data={selectedCompany}
                onSave={handleSaveCompany}
                isSaving={isCreating || isUpdating}
            />

            {/* Custom Details View Modal */}
            <DetailsViewModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Company Details"
                logoUrl={selectedDetails?.logo}
                fields={[
                    { label: "Company Name", value: selectedDetails?.name },
                    { label: "Contact Number", value: selectedDetails?.contact || "N/A" },
                    { label: "Office Address", value: selectedDetails?.address || "N/A" },
                    { label: "Status", value: selectedDetails?.status || "Active" },
                    { label: "Company ID", value: selectedDetails?.id },
                    { label: "Created At", value: selectedDetails?.createdAt ? new Date(selectedDetails.createdAt).toLocaleString() : "N/A" },
                    { label: "Updated At", value: selectedDetails?.updatedAt ? new Date(selectedDetails.updatedAt).toLocaleString() : "N/A" },
                ]}
            />

            {/* Custom Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Company"
                description={`Are you sure you want to delete company "${companies.find((c: any) => c.id === deleteId)?.name || ""}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CompanyList;