// "use client";

// import { motion } from "framer-motion";
// import { Edit2, MapPin, Plus, Search, Trash2, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { AreaModal } from "./_components/AreaModal";
// import {
//     useGetAreasQuery,
//     useUpdateAreaMutation,
//     useDeleteAreaMutation
// } from "@/components/Redux/RTK/distributorApiNode";

// const AreaRouteList = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingArea, setEditingArea] = useState<any>(null);
//     const [searchTerm, setSearchTerm] = useState("");

//     const { data: areas = [], isLoading } = useGetAreasQuery({ search: searchTerm });
//     const [updateArea] = useUpdateAreaMutation();
//     const [deleteArea] = useDeleteAreaMutation();

//     const handleToggleStatus = async (area: any) => {
//         try {
//             await updateArea({
//                 id: area.id,
//                 data: {
//                     status: area.status === "Active" ? "Inactive" : "Active"
//                 }
//             }).unwrap();
//         } catch (err: any) {
//             alert(err?.data?.message || "Failed to update status");
//         }
//     };

//     const handleDelete = async (id: string) => {
//         if (!confirm("Are you sure you want to delete this area?")) return;
//         try {
//             await deleteArea(id).unwrap();
//         } catch (err: any) {
//             alert(err?.data?.message || "Failed to delete area");
//         }
//     };

//     const handleEditClick = (area: any) => {
//         setEditingArea(area);
//         setIsModalOpen(true);
//     };

//     const handleAddClick = () => {
//         setEditingArea(null);
//         setIsModalOpen(true);
//     };

//     return (
//         <div className="p-8 bg-[#F8FAFC] min-h-screen">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                 <div>
//                     <h1 className="text-2xl font-black text-[#001f3f] tracking-tight">Area / Route List</h1>
//                     <p className="text-slate-500 text-sm font-medium mt-1">Manage and organize your service zones efficiently.</p>
//                 </div>

//                 <motion.button
//                     whileHover={{ scale: 1.02, translateY: -2 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleAddClick}
//                     className="flex items-center justify-center gap-2 bg-[#001f3f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
//                 >
//                     <Plus size={18} strokeWidth={3} />
//                     Add New Area
//                 </motion.button>
//             </div>

//             {/* Table Container */}
//             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
//                 {/* Table Search & Filter */}
//                 <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
//                     <div className="relative w-full max-w-xs">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                         <input
//                             type="text"
//                             placeholder="Search area or routes..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-foreground"
//                         />
//                     </div>
//                 </div>

//                 {isLoading ? (
//                     <div className="flex flex-col justify-center items-center py-20">
//                         <Loader2 className="animate-spin h-8 w-8 text-primary mb-3" />
//                         <p className="text-sm text-slate-500 font-medium">Loading areas...</p>
//                     </div>
//                 ) : areas.length ? (
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead className="bg-slate-50/50 text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black">
//                                 <tr>
//                                     <th className="px-8 py-5">SL</th>
//                                     <th className="px-8 py-5">Area / Route Name</th>
//                                     <th className="px-8 py-5">Note</th>
//                                     <th className="px-8 py-5 text-center">Status</th>
//                                     <th className="px-8 py-5 text-right">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-50">
//                                 {areas.map((area: any, index: number) => (
//                                     <tr key={area.id} className="hover:bg-blue-50/30 transition-colors group">
//                                         <td className="px-8 py-5 text-sm font-bold text-slate-400">
//                                             {String(index + 1).padStart(2, "0")}
//                                         </td>
//                                         <td className="px-8 py-5">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#001f3f] group-hover:bg-[#001f3f] group-hover:text-white transition-all">
//                                                     <MapPin size={18} />
//                                                 </div>
//                                                 <span className="font-bold text-[#001f3f]">{area.name}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-5 text-sm text-slate-500 italic max-w-xs truncate" title={area.note}>
//                                             {area.note || "No notes added"}
//                                         </td>
//                                         <td className="px-8 py-5">
//                                             <div className="flex justify-center">
//                                                 <label className="relative inline-flex items-center cursor-pointer select-none">
//                                                     <input
//                                                         type="checkbox"
//                                                         className="sr-only peer"
//                                                         checked={area.status === "Active"}
//                                                         onChange={() => handleToggleStatus(area)}
//                                                     />
//                                                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                                                 </label>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-5">
//                                             <div className="flex items-center justify-end gap-2">
//                                                 <button
//                                                     onClick={() => handleEditClick(area)}
//                                                     className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors cursor-pointer"
//                                                     title="Edit Area"
//                                                 >
//                                                     <Edit2 size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(area.id)}
//                                                     className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
//                                                     title="Delete Area"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                         <MapPin size={48} className="text-slate-300 mb-2" />
//                         <p className="text-sm font-medium">No areas found. Add a new area zone to start.</p>
//                     </div>
//                 )}
//             </div>

//             <AreaModal
//                 isOpen={isModalOpen}
//                 onClose={() => {
//                     setIsModalOpen(false);
//                     setEditingArea(null);
//                 }}
//                 initialData={editingArea}
//             />
//         </div>
//     );
// };

// export default AreaRouteList;

"use client";

import { motion } from "framer-motion";
import {
    Edit2,
    Loader2,
    MapPin,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { AreaModal } from "./_components/AreaModal";

import {
    useDeleteAreaMutation,
    useGetAreasQuery,
    useUpdateAreaMutation,
} from "@/components/Redux/RTK/distributorApiNode";

import {
    Circle,
    GoogleMap,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "260px",
};

const libraries: any[] = ["places"];

const AreaRouteList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: areas = [], isLoading } =
        useGetAreasQuery({
            search: searchTerm,
        });

    const [updateArea] =
        useUpdateAreaMutation();

    const [deleteArea] =
        useDeleteAreaMutation();

    const { isLoaded, loadError } =
        useJsApiLoader({
            googleMapsApiKey:
                process.env
                    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
                "",
            libraries,
        });

    const handleToggleStatus = async (
        area: any
    ) => {
        try {
            await updateArea({
                id: area.id,
                data: {
                    status:
                        area.status === "Active"
                            ? "Inactive"
                            : "Active",
                },
            }).unwrap();
        } catch (err: any) {
            alert(
                err?.data?.message ||
                "Failed to update status"
            );
        }
    };

    const handleDelete = async (
        id: string
    ) => {
        if (
            !confirm(
                "Are you sure you want to delete this area?"
            )
        )
            return;

        try {
            await deleteArea(id).unwrap();
        } catch (err: any) {
            alert(
                err?.data?.message ||
                "Failed to delete area"
            );
        }
    };

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#001f3f]">
                        Area Coverage List
                    </h1>

                    <p className="text-slate-500 text-sm mt-1">
                        Manage service areas and
                        coverage zones.
                    </p>
                </div>

                <motion.button
                    whileHover={{
                        scale: 1.02,
                        y: -2,
                    }}
                    whileTap={{
                        scale: 0.98,
                    }}
                    onClick={() => {
                        setEditingArea(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#001f3f] text-white px-6 py-3 rounded-2xl font-bold"
                >
                    <Plus size={18} />
                    Add Area
                </motion.button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                    />

                    <input
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        placeholder="Search area..."
                        className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            ) : areas.length ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {areas.map((area: any) => (
                        <div
                            key={area.id}
                            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl"
                        >
                            <div className="p-5 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-xl text-[#001f3f]">
                                            {area.name}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {area.note ||
                                                "No notes"}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${area.status ===
                                                "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {area.status}
                                    </span>
                                </div>
                            </div>

                            <div className="h-[260px]">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={
                                            mapContainerStyle
                                        }
                                        center={{
                                            lat:
                                                area.latitude ||
                                                24.9197,
                                            lng:
                                                area.longitude ||
                                                89.9481,
                                        }}
                                        zoom={
                                            area.zoom || 12
                                        }
                                        options={{
                                            disableDefaultUI:
                                                true,
                                        }}
                                    >
                                        <Marker
                                            position={{
                                                lat:
                                                    area.latitude ||
                                                    24.9197,
                                                lng:
                                                    area.longitude ||
                                                    89.9481,
                                            }}
                                        />

                                        <Circle
                                            center={{
                                                lat:
                                                    area.latitude ||
                                                    24.9197,
                                                lng:
                                                    area.longitude ||
                                                    89.9481,
                                            }}
                                            radius={
                                                (area.coverage_radius ||
                                                    5) * 1000
                                            }
                                            options={{
                                                fillColor:
                                                    "#2563eb",
                                                fillOpacity:
                                                    0.2,
                                                strokeColor:
                                                    "#2563eb",
                                                strokeWeight:
                                                    2,
                                            }}
                                        />
                                    </GoogleMap>
                                ) : loadError ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 border-y text-center p-4">
                                        <MapPin size={24} className="text-slate-300 mb-1" />
                                        <p className="text-xs font-semibold text-slate-500">Map Unavailable</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 border-y">
                                        Loading map...
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Coverage
                                        </p>
                                        <p className="font-black text-lg">
                                            {
                                                area.coverage_radius
                                            }
                                            km
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Latitude
                                        </p>
                                        <p className="font-semibold">
                                            {area.latitude}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Longitude
                                        </p>
                                        <p className="font-semibold">
                                            {area.longitude}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={
                                                area.status ===
                                                "Active"
                                            }
                                            onChange={() =>
                                                handleToggleStatus(
                                                    area
                                                )
                                            }
                                        />

                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-green-500" />
                                    </label>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingArea(
                                                    area
                                                );
                                                setIsModalOpen(
                                                    true
                                                );
                                            }}
                                            className="p-2 bg-blue-50 rounded-xl text-blue-600"
                                        >
                                            <Edit2
                                                size={16}
                                            />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    area.id
                                                )
                                            }
                                            className="p-2 bg-red-50 rounded-xl text-red-500"
                                        >
                                            <Trash2
                                                size={16}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center">
                    <MapPin
                        size={50}
                        className="text-slate-300"
                    />
                    <p className="mt-3 text-slate-500">
                        No area found
                    </p>
                </div>
            )}

            <AreaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingArea(null);
                }}
                initialData={editingArea}
            />
        </div>
    );
};

export default AreaRouteList;