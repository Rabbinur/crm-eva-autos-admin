"use client";

import { useMyProfileQuery, useUpdateProfileMutation } from "@/components/Redux/RTK/authApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAppDispatch } from "@/components/Redux/hooks";
import { setUserInfo } from "@/components/Redux/Slice/authSlice";

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

// 1️⃣ Define Zod schema
const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone_number: z.string().min(10, "Phone number is required"),
    driving_license: z.string().optional(),
    work_place: z.string().optional(),
    profile_picture: z.any().optional(), // File
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
    const dispatch = useAppDispatch();
    const { data,refetch } = useMyProfileQuery(undefined);
    const user = data?.data;
    const [updateProfile] = useUpdateProfileMutation();


    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            phone_number: "",
            driving_license: "",
            work_place: "",
            profile_picture: undefined,
        },
    });

    // 2️⃣ Pre-fill form when user data is loaded
    React.useEffect(() => {
        if (user) {
            setValue("name", user.name || "");
            setValue("phone_number", user.phone_number || "");
            setValue("driving_license", user.driving_license || "");
            setValue("work_place", user.work_place || "");
            setValue("profile_picture", undefined);
        }
    }, [user, setValue]);

    // 3️⃣ Submit handler
    const onSubmit = async (values: ProfileFormValues) => {
        const fd = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value) fd.append(key, value as any);
        });

        try {
            const result = await updateProfile(fd).unwrap();
            if (result?.status_code === 200 || result?.status === "success") {
                toast.success("Profile updated successfully!");
                if (result.data) {
                    dispatch(
                        setUserInfo({
                            email: result.data.email || user?.email,
                            name: result.data.name || user?.name,
                            email_verified: true,
                            role: result.data.role || user?.role,
                            profile: result.data.profile_picture || result.data.image || ""
                        })
                    );
                }
                onClose();
                refetch()
            } else {
                toast.error(result?.message || "Update failed.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Update failed, try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                {user ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Profile Picture */}
                        <div className="relative w-16 h-16">
                            {user.profile_picture ? (
                                <Image
                                    src={user.profile_picture}
                                    alt="Profile"
                                    width={64}
                                    height={64}
                                    className="rounded-full border object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    No Image
                                </div>
                            )}
                            <label
                                htmlFor="profile_picture"
                                className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer hover:bg-primary/80 transition"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </label>
                            <Controller
                                control={control}
                                name="profile_picture"
                                render={({ field }) => (
                                    <input
                                        id="profile_picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                        className="hidden"
                                    />
                                )}
                            />
                        </div>


                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name")} disabled={isSubmitting} />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input id="phone_number" {...register("phone_number")} disabled={isSubmitting} />
                            {errors.phone_number && (
                                <p className="text-red-600 text-sm">{errors.phone_number.message}</p>
                            )}
                        </div>

                        {/* Driving License */}
                        <div>
                            <Label htmlFor="driving_license">Driving License</Label>
                            <Input id="driving_license" {...register("driving_license")} disabled={isSubmitting} />
                            {errors.driving_license && (
                                <p className="text-red-600 text-sm">{errors.driving_license.message}</p>
                            )}
                        </div>

                        {/* Workplace */}
                        <div>
                            <Label htmlFor="work_place">Workplace</Label>
                            <Input id="work_place" {...register("work_place")} disabled={isSubmitting} />
                            {errors.work_place && (
                                <p className="text-red-600 text-sm">{errors.work_place.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                ) : (
                    <p className="text-center text-gray-500">Loading user data...</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
