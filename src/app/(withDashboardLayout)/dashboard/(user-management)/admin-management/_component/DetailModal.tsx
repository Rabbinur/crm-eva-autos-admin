// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Calendar, Mail, Phone, User } from "lucide-react";
// import Image from "next/image";
// import React from "react";

// interface DetailModalProps {
//     detailModalOpen: boolean;
//     setDetailModalOpen: (open: boolean) => void;
//     selectedRow: Record<string, any> | null;
// }

// export const DetailModal: React.FC<DetailModalProps> = ({
//     detailModalOpen,
//     setDetailModalOpen,
//     selectedRow,
// }) => {
//     console.log("selected row",selectedRow)
//     const formatDate = (dateString: string | null) => {
//         if (!dateString) return "N/A";
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });
//     };

//     return (
//         <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
//             <DialogContent className="max-w-4xl  bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl">
//                 <DialogHeader className="text-center ">
//                     <DialogTitle className="text-2xl font-semibold text-gray-800">
//                         Profile Details
//                     </DialogTitle>
//                     <DialogDescription className="text-gray-700">
//                         View full record information below
//                     </DialogDescription>
//                 </DialogHeader>

//                 {selectedRow ? (
//                     <div className="mt- 6 flex flex-col items-center">
//                         {/* ✅ Profile image section */}
//                         <div className="relative">
//                             {selectedRow.profile_picture ? (
//                                 <Image
//                                     src={selectedRow.profile_picture}
//                                     alt={selectedRow.name || "Profile"}
//                                     width={100}
//                                     height={100}
//                                     className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
//                                 />
//                             ) : (
//                                 <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-700 shadow-md">
//                                     <User className="w-8 h-8" />
//                                 </div>
//                             )}
//                         </div>

//                         <div className="mt-4 text-center">
//                             <h2 className="text-xl font-medium text-gray-800">
//                                 {selectedRow.name || "N/A"}
//                             </h2>
//                             <p className="text-sm text-gray-700 capitalize">
//                                 {selectedRow.role || "User"}
//                             </p>
//                         </div>

//                         {/* ✅ Quick Info Row */}
//                         <div className="flex flex-wrap justify-center mt-3 gap-4 text-gray-600 text-sm">
//                             {selectedRow.email && (
//                                 <div className="flex items-center gap-1">
//                                     <Mail className="w-4 h-4 text-gray-700" />
//                                     {selectedRow.email}
//                                 </div>
//                             )}
//                             {selectedRow.phone_number && (
//                                 <div className="flex items-center gap-1">
//                                     <Phone className="w-4 h-4 text-gray-700" />
//                                     {selectedRow.phone_number}
//                                 </div>
//                             )}
//                             {selectedRow.date_of_birth && (
//                                 <div className="flex items-center gap-1">
//                                     <Calendar className="w-4 h-4 text-gray-700" />
//                                     {formatDate(selectedRow.date_of_birth)}
//                                 </div>
//                             )}
//                         </div>

//                         {/* ✅ Data Grid */}
//                         <div className="mt-5 w-full grid grid-cols-1 sm:grid-cols-4 gap-5">
//                             {Object.entries(selectedRow).map(([key, value]) => {
//                                 if (["profile_picture",
//                                     "name",
//                                     "email",
//                                     "role",
//                                     "phone_number",
//                                     "date_of_birth",
//                                     "last_login_at",
//                                     "created_at",
//                                     "createdAt",
//                                     "updatedAt",
//                                     "updated_at",
//                                     "is_verified",
//                                     "provider",
//                                     "id"].includes(key))
//                                     return null;

//                                 const isDate =
//                                     key.includes("date") || key.includes("_at");

//                                 return (
//                                     <div
//                                         key={key}
//                                         className="p-2 bg-gray-50  gap -5 items-center hover:bg-gray-100 border border-gray-100 rounded-xl transition-all duration-150"
//                                     >
//                                         <p className="text-xs text-gray-700 uppercase tracking-wide">
//                                             {key.replace(/_/g, " ")}
//                                         </p>
//                                         <p className="text-sm hi dden font-medium text-gray-800 mt -1 break-all">
//                                             {isDate ? formatDate(value as string) : value || "N/A"}
//                                         </p>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-center text-gray-700 mt-4">No data available.</p>
//                 )}

//                 <DialogFooter className="mt-6 flex justify-center">
//                     <Button
//                         variant="outline"
//                         onClick={() => setDetailModalOpen(false)}
//                         className="px-6 rounded-full"
//                     >
//                         Close
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import React from "react";
const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // invalid date
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

interface DetailModalProps {
    detailModalOpen: boolean;
    setDetailModalOpen: (open: boolean) => void;
    selectedRow: Record<string, any> | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({
    detailModalOpen,
    setDetailModalOpen,
    selectedRow,
}) => {
    /* ------------------------ helpers ------------------------ */
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
const renderValue = (value: any, isDate = false) => {
  if (isDate) return formatDate(value); // date safe
  if (value === null || value === undefined) return "N/A"; // null / undefined
  if (typeof value === "object") return JSON.stringify(value); // object/array
  return value; // string or number
};

    const normalizeUser = (row: any) => {
        if (!row) return null;

        const isCustomer = row.role === "client";

        return {
            name: row.name,
            roleLabel: isCustomer ? "Customer" : "Admin",
            email: row.email,
            phone: row.phone_number,
            profile_picture: row.profile_picture,
            date_of_birth: row.date_of_birth,
            user_id: row.user_id,
            status: row.status,
            created_at: row.createdAt || row.created_at,

            // customer only
            reward_level: isCustomer ? row.reward_level : null,
            available_points: isCustomer ? row.reward?.available : null,

            raw: row,
        };
    };

    const data = normalizeUser(selectedRow);

    /* ------------------------ UI ------------------------ */
    return (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
            <DialogContent className="max-w-4xl bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">
                        Profile Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-700">
                        View full record information below
                    </DialogDescription>
                </DialogHeader>

                {data ? (
                    <div className="mt-6 flex flex-col items-center">
                        {/* -------- Profile Image -------- */}
                        <div className="relative">
                            {data.profile_picture ? (
                                <Image
                                    src={data.profile_picture}
                                    alt={data.name || "Profile"}
                                    width={100}
                                    height={100}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-700 shadow-md">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        {/* -------- Name & Role -------- */}
                        <div className="mt-4 text-center">
                            <h2 className="text-xl font-medium text-gray-800">
                                {data.name || "N/A"}
                            </h2>
                            <p className="text-sm text-gray-700">{data.roleLabel}</p>
                        </div>

                        {/* -------- Quick Info -------- */}
                        <div className="flex flex-wrap justify-center mt-3 gap-4 text-gray-600 text-sm">
                            {data.email && (
                                <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {data.email}
                                </div>
                            )}

                            {data.phone && (
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {data.phone}
                                </div>
                            )}

                            {data.date_of_birth && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(data.date_of_birth)}
                                </div>
                            )}
                        </div>

                        {/* -------- Customer-only Info -------- */}
                        {selectedRow?.role === "client" && (
                            <div className="mt-4 flex gap-6 text-sm text-gray-700">
                                <span>
                                    <b>Reward Level:</b> {data.reward_level || "N/A"}
                                </span>
                                <span>
                                    <b>Available Points:</b> {data.available_points ?? 0}
                                </span>
                            </div>
                        )}

                        {/* -------- Data Grid -------- */}
                        <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-4 gap-5">
                            {Object.entries(data.raw).map(([key, value]) => {
                                const hiddenKeys = [
                                    "profile_picture",
                                    "reward",
                                    "name",
                                    "email",
                                    "role",
                                    "phone_number",
                                    "date_of_birth",
                                    "createdAt",
                                    "created_at",
                                    "updatedAt",
                                    "updated_at",
                                    "is_verified",
                                    "provider",
                                    "id",
                                ];

                                if (hiddenKeys.includes(key)) return null;

                                const isDate =
                                    key.includes("date") || key.includes("_at");

                                const label = key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase());

                                return (
                                    <div
                                        key={key}
                                        className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition"
                                    >
                                        <p className="text-xs text-gray-700 uppercase tracking-wide">
                                            {label}
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 break-all">
                                             {renderValue(value, isDate)}

                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-700 mt-4">
                        No data available.
                    </p>
                )}

                <DialogFooter className="mt-6 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setDetailModalOpen(false)}
                        className="px-6 rounded-full"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
