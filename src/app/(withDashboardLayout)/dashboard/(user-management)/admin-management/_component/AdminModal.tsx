

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FieldErrors, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

// -------------------
// Zod Validation Schema
// -------------------
const adminSchema = z
    .object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        phone_number: z.string().min(5, "Phone number required"),
    
        password: z
            .string()
            .optional()
            .refine((val) => !val || val.length >= 8, "Password must be at least 8 characters"),
        password_confirmation: z.string().optional(),
        role: z.enum(["admin", "moderator", "client"]).default("admin"),
        date_of_birth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).default("female"),
        status: z.enum(["active", "inactive"]).default("active"),
    })
    .refine((data) => {
        // Only validate password confirmation if password is provided
        if (data.password) {
            return data.password === data.password_confirmation;
        }
        return true;
    }, { message: "Passwords do not match", path: ["password_confirmation"] });

type AdminFormValues = z.infer<typeof adminSchema>;

// -------------------
// Props
// -------------------
interface AdminModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: AdminFormValues) => void;
    initialData?: any;
    defaultRole?: AdminFormValues["role"];
}

// -------------------
// Component
// -------------------
export default function AdminModal({ open, onClose, onSubmit, initialData, defaultRole }: AdminModalProps) {
    const isEditMode = Boolean(initialData?.id);

    // -------------------
    // React Hook Form Setup
    // -------------------
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AdminFormValues>({
        resolver: zodResolver(adminSchema) as unknown as Resolver<AdminFormValues>,
        defaultValues: {
            name: "",
            email: "",
            phone_number: "",
         
            password: "",
            password_confirmation: "",
            role: defaultRole ?? "admin",
            date_of_birth: "",
            gender: "female",
            status: "active",
        },
    });

    const watchedRole = watch("role");

    // -------------------
    // Reset form when modal opens or initialData changes
    // -------------------
    useEffect(() => {
        reset({
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            phone_number: initialData?.phone_number ?? "",
        
            password: "",
            password_confirmation: "",
            role: initialData?.role ?? defaultRole ?? "admin",
            date_of_birth: initialData?.date_of_birth ?? "",
            gender: initialData?.gender ?? "female",
            status: initialData?.status ?? "active",
        });
    }, [initialData, reset, defaultRole]);

    // -------------------
    // Form Submission
    // -------------------
    const handleFormSubmit: SubmitHandler<AdminFormValues> = async (data) => {
        let payload: Partial<AdminFormValues> = {};

        // CREATE
        if (!initialData?.id) {
            payload = {
                name: data.name,
                phone_number: data.phone_number,
                email: data.email,
                role: data.role,
                status: data.status,
            };

            if (data.password?.trim()) {
                payload.password = data.password;
            }
        }

        // UPDATE
        else {
            const currentValues = {
                name: data.name,
                email: data.email,
                phone_number: data.phone_number,
                role: data.role,
                // work_place: data.work_place,
                // driving_license: data.driving_license,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                status: data.status,
            };

            Object.entries(currentValues).forEach(([key, value]) => {
                const oldValue = initialData?.[key];

                if (value !== oldValue) {
                    (payload as any)[key] = value;
                }
            });

            // password change হলে শুধু password পাঠাবে
            if (data.password?.trim()) {
                payload.password = data.password;
            }
        }

        // কিছুই change না হলে
        if (Object.keys(payload).length === 0) {
            toast.info("No changes detected");
            return;
        }

        await onSubmit(payload as AdminFormValues);
    };
    // -------------------
    // Handle errors with toast
    // -------------------
    const handleFormError = (errors: FieldErrors<AdminFormValues>) => {
        Object.values(errors).forEach((error) => {
            if (error?.message) toast.error(error.message);
        });
    };

    // -------------------
    // Reset when modal closes
    // -------------------
    useEffect(() => {
        if (!open) {
            reset({
                name: "",
                email: "",
                phone_number: "",
              
                password: "",
                password_confirmation: "",
                role: defaultRole ?? "admin",
                date_of_birth: "",
                gender: "female",
                status: "active",
            });
        }
    }, [open, reset, defaultRole]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[850px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? `Edit ${watchedRole}` : `Create ${watchedRole}`}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? `Update ${watchedRole} information and click update.`
                            : `Fill in the details below to create a new ${watchedRole}.`}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="grid gap-4 py-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input {...register("name")} placeholder="Enter name" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input {...register("email")} placeholder="Enter email" />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input {...register("phone_number")} placeholder="Enter phone" />
                            {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input type="password" {...register("password")} placeholder="Enter password" />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div>
                            <Label>Confirm Password</Label>
                            <Input type="password" {...register("password_confirmation")} placeholder="Confirm password" />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
                            )}
                        </div>

                        {isEditMode && (
                            <>
                               
                                <div>
                                    <Label>Date of Birth</Label>
                                    <Input type="date" {...register("date_of_birth")} />
                                </div>
                                <div>
                                    <Label>Gender</Label>
                                    <Select
                                        onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
                                        value={watch("gender")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Status</Label>

                                    <Select
                                        onValueChange={(value) =>
                                            setValue("status", value as "active" | "inactive")
                                        }
                                        value={watch("status")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>

                    {!isEditMode && (
                        <p className="text-gray-500 italic mt-2">
                            A verification mail will be sent to your email address after creating {watchedRole}.
                        </p>
                    )}

                    <DialogFooter className="mt-4 flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                            {isSubmitting
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update"
                                    : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
