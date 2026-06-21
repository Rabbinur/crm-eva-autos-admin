"use client";

import { useUpdateProfileMutation } from "@/components/Redux/RTK/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EditProfile() {
  const [updateProfile] = useUpdateProfileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    console.groupCollapsed("--- Form Data ---");
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(
          `Key: ${key}, File: ${value.name}, Type: ${value.type}, Size: ${value.size}`
        );
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });
    console.groupEnd();

    try {
      const result = await updateProfile(formData).unwrap();

      console.log("Update profile result:", result);

      // ✅ Check the expected response structure
      if (result?.status_code === 200 || result?.status === "success") {
        toast.success("Profile updated successfully!");
        form.reset();
        router.push("/dashboard/profile");
      } else {
        console.warn("Unexpected response:", result);
        toast.error(result?.message || "Something went wrong while updating the profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // ✅ Handle error from RTK Query or Axios-style response
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Edit Profile
        </h1>
        <p className="text-center text-gray-500">
          Update your information and upload a profile image.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-1">
            <Label htmlFor="profile_picture">Profile Image</Label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              // required
              disabled={isSubmitting}
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., John Doe"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="e.g., 8801XXXXXXXXX"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* DL No & Workplace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="driving_license">Driver's License No</Label>
              <Input
                id="driving_license"
                name="driving_license"
                type="text"
                placeholder="e.g., 2342342321"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="workplace">Workplace</Label>
              <Input
                id="work_place"
                name="work_place"
                type="text"
                placeholder="e.g., Dhaka"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          {/* <div className="space-y-1 hidden">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., abc@gmail.com"
              disabled={isSubmitting}
            />
          </div> */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4"
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
