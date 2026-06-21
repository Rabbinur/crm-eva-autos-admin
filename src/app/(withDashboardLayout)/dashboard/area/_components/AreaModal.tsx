
"use client";

import { useCreateAreaMutation, useUpdateAreaMutation } from "@/components/Redux/RTK/distributorApiNode";
import { Autocomplete, Circle, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        id: string;
        name: string;
        note?: string;
        status: "Active" | "Inactive";
        coverage_radius?: number;
        latitude?: number;
        longitude?: number;
        zoom?: number;
    };
}

const libraries: any[] = ["places"];

export const AreaModal = ({
    isOpen,
    onClose,
    initialData,
}: AreaModalProps) => {
    const [name, setName] = useState("");
    const [note, setNote] = useState("");

    const [coverageRadius, setCoverageRadius] = useState(5);
    const [latitude, setLatitude] = useState(24.9197);
    const [longitude, setLongitude] = useState(89.9481);
    const [zoom, setZoom] = useState(12);

    const [createArea, { isLoading: isCreating }] =
        useCreateAreaMutation();

    const [updateArea, { isLoading: isUpdating }] =
        useUpdateAreaMutation();

    const isSaving = isCreating || isUpdating;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    useEffect(() => {
        if (!isOpen) return;


        setName(initialData?.name || "");
        setNote(initialData?.note || "");

        setCoverageRadius(initialData?.coverage_radius || 5);
        setLatitude(initialData?.latitude || 24.9197);
        setLongitude(initialData?.longitude || 89.9481);
        setZoom(initialData?.zoom || 12);


    }, [initialData, isOpen]);

    const center = useMemo(
        () => ({
            lat: Number(latitude),
            lng: Number(longitude),
        }),
        [latitude, longitude]
    );

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();
            if (lat !== undefined && lng !== undefined) {
                setLatitude(lat);
                setLongitude(lng);
                setZoom(14);
            }
            const placeName = place.name || place.formatted_address;
            if (placeName) {
                setName(placeName);
            }
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());


    };

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Area name is required");
            return;
        }

        try {
            const payload = {
                name,
                note,
                coverage_radius: Number(coverageRadius),
                latitude: Number(latitude),
                longitude: Number(longitude),
                zoom: Number(zoom),
            };

            if (initialData?.id) {
                await updateArea({
                    id: initialData.id,
                    data: payload,
                }).unwrap();
            } else {
                await createArea(payload).unwrap();
            }

            onClose();
        } catch (err: any) {
            alert(
                err?.data?.message ||
                "Failed to save area"
            );
        }


    };

    return (<AnimatePresence>
        {isOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#001f3f]/50 backdrop-blur-sm"
            />

            <motion.div
                initial={{
                    scale: 0.95,
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    scale: 0.95,
                    opacity: 0,
                    y: 20,
                }}
                className="relative
w-[98vw]
max-w-7xl
h-[95vh]
bg-white
rounded-2xl
sm:rounded-3xl
shadow-2xl
overflow-hidden
flex
flex-col"
            >
                <div className="p-5 sm:p-8 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-[#001f3f]">
                            {initialData
                                ? "Edit Area"
                                : "Add New Area"}
                        </h2>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full"
                        >
                            <Plus
                                size={20}
                                className="rotate-45"
                            />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-8 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto">

                    <div className="space-y-5">

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                Area Name
                            </label>

                            {isLoaded ? (
                                <Autocomplete
                                    onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
                                    onPlaceChanged={onPlaceChanged}
                                >
                                    <input
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Search area name..."
                                        className="w-full px-5 py-4 rounded-2xl border bg-slate-50 text-foreground"
                                    />
                                </Autocomplete>
                            ) : (
                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Mymensingh Sadar"
                                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 text-foreground"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                Note
                            </label>

                            <textarea
                                rows={4}
                                value={note}
                                onChange={(e) =>
                                    setNote(e.target.value)
                                }
                                placeholder="Area notes..."
                                className="w-full px-5 py-4 rounded-2xl border bg-slate-50 resize-none text-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                Coverage Radius (KM)
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={coverageRadius}
                                onChange={(e) =>
                                    setCoverageRadius(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full px-5 py-4 rounded-2xl border bg-slate-50 text-foreground"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Latitude
                                </label>

                                <input
                                    type="number"
                                    step="0.000001"
                                    value={latitude}
                                    onChange={(e) =>
                                        setLatitude(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Longitude
                                </label>

                                <input
                                    type="number"
                                    step="0.000001"
                                    value={longitude}
                                    onChange={(e) =>
                                        setLongitude(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full px-5 py-4 rounded-2xl border bg-slate-50 text-foreground"
                                />
                            </div>

                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin
                                    size={18}
                                    className="text-blue-600"
                                />
                                <h4 className="font-bold text-[#001f3f]">
                                    Coverage Summary
                                </h4>
                            </div>

                            <p className="text-sm text-slate-600">
                                Radius: {coverageRadius} KM
                            </p>

                            <p className="text-sm text-slate-600">
                                Lat: {latitude}
                            </p>

                            <p className="text-sm text-slate-600">
                                Lng: {longitude}
                            </p>
                        </div>
                    </div>

                    <div>

                        <h3 className="font-black text-[#001f3f] mb-3">
                            Coverage Map
                        </h3>

                        <div className="overflow-hidden rounded-3xl border border-slate-200">

                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerClassName="w-full h-[240px] sm:h-[320px] lg:h-[400px]"
                                    center={center}
                                    zoom={zoom}
                                    onClick={handleMapClick}
                                >
                                    <Marker
                                        draggable
                                        position={center}
                                        onDragEnd={(e) => {
                                            if (!e.latLng) return;

                                            setLatitude(
                                                e.latLng.lat()
                                            );

                                            setLongitude(
                                                e.latLng.lng()
                                            );
                                        }}
                                    />

                                    <Circle
                                        center={center}
                                        radius={
                                            coverageRadius * 1000
                                        }
                                        options={{
                                            fillColor: "#2563eb",
                                            fillOpacity: 0.15,
                                            strokeColor: "#2563eb",
                                            strokeOpacity: 1,
                                            strokeWeight: 2,
                                        }}
                                    />
                                </GoogleMap>
                            ) : loadError ? (
                                <div className="h-[240px] sm:h-[320px] lg:h-[400px] flex flex-col items-center justify-center bg-slate-50 border border-dashed rounded-3xl p-4 text-center">
                                    <MapPin size={32} className="text-slate-300 mb-2" />
                                    <p className="text-sm font-semibold text-slate-500">Map Unavailable</p>
                                    <p className="text-xs text-slate-400 mt-1">Please enter coordinates manually or check your internet settings.</p>
                                </div>
                            ) : (
                                <div className="h-[240px] sm:h-[320px] lg:h-[400px] flex items-center justify-center">
                                    Loading Map...
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
                            Click anywhere on the map or drag
                            the marker to set area location.
                        </p>
                    </div>
                </div>

                <div className="border-t p-5 sm:p-6 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-4 rounded-2xl bg-[#001f3f] text-white font-bold"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save Area"}
                    </button>
                </div>
            </motion.div>
        </div>
        )}
    </AnimatePresence>
    );
};
