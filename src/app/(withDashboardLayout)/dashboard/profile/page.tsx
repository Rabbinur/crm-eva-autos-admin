"use client";

import { useMyProfileQuery } from "@/components/Redux/RTK/authApi";
import React, { useState } from "react";
import { ChangePasswordModal } from "./_components/ChangePasswordModal";
// Import Lucide Icons
import {
  AlertCircle,
  Building,
  CreditCard,
  IdCard,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User
} from "lucide-react";
import Image from "next/image";
import EditProfileDialog from "./_components/EditProfileDialog";

// Helper component for displaying a single profile item
const ProfileDetailItem: React.FC<{
  label: string;
  value: string | undefined | null | React.ReactNode;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-none shadow-xs border border-gray-200/60">
    {/* Icon Color: Navy Blue */}
    <div className="text-slate-800 shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      {/* Label: Muted Gray */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
        {label}
      </p>
      {/* Value: Strong Black */}
      <p className="text-sm font-bold text-gray-900 wrap-break-word mt-0.5">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

const MyProfile: React.FC = () => {
  const { data, isLoading, isError } = useMyProfileQuery(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const user = data?.data;

  // বুলেটরপ্রুফ ইমেজ ইউআরএল হ্যান্ডলিং
  const profileImageSrc = (user?.profile_picture && user.profile_picture.trim() !== "")
    ? user.profile_picture
    : (user?.image && user.image.trim() !== "")
      ? user.image
      : "/user-vector.jpg";

  // --- Loading State ---
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-slate-900 mb-3" />
        <p className="text-lg font-medium text-slate-800">
          Loading your profile data...
        </p>
      </div>
    );

  // --- Error State ---
  if (isError || !user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-red-50 border-t-4 border-red-600">
        <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
        <p className="text-xl sm:text-2xl font-bold text-red-700 mb-2">
          Profile Load Failed 🙁
        </p>
        <p className="text-base text-red-600 text-center">
          We could not retrieve your profile information. Please check your
          connection and try again.
        </p>
      </div>
    );

  const iconSize = 20;

  const mainInfo = [
    { label: "User ID", value: user?.user_id, icon: <CreditCard size={iconSize} /> },
    { label: "Name", value: user?.name, icon: <User size={iconSize} /> },
    { label: "Email", value: user?.email, icon: <Mail size={iconSize} /> },
    { label: "Primary Phone", value: user?.phone_number || "N/A", icon: <Phone size={iconSize} /> },
    { label: "Driving License", value: user?.driving_license, icon: <IdCard size={iconSize} /> },
    { label: "Workplace", value: user?.work_place || "N/A", icon: <Building size={iconSize} /> },
    {
      label: "Birth Date",
      value: user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "N/A",
      icon: <Building size={iconSize} />,
    },
    { label: "Role", value: user?.role || "None", icon: <ShieldCheck size={iconSize} /> },
    {
      label: "Active",
      value: user?.status === "active" ? (
        <span className="inline-flex items-center text-emerald-600 font-bold">
          <ShieldCheck className="w-4 h-4 mr-1" /> Yes
        </span>
      ) : (
        <span className="text-gray-500">No</span>
      ),
      icon: <Lock size={iconSize} />,
    },
  ];

  const profileInfo = [
    { label: "Profile ID", value: user?._id, icon: <CreditCard size={iconSize} /> },
    {
      label: "Profile Photo",
      value: (
        <img
          src={profileImageSrc}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
      ),
      icon: <User size={iconSize} />,
    },
  ];

  return (
    <div className="container mx-auto px-5 py-8 bg-white min-h-screen">
      <header className="text-center mb-10">
        {/* Navy Blue & Black Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
          <span className="text-slate-900">My Account</span> Overview
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 max-w-md mx-auto">
          A sleek, industrial look at your professional profile details.
        </p>
      </header>

      {/* Profile Image with Slate Border */}
      <div className="flex justify-center mb-8">
        <div className="p-1 border-2 border-slate-900 rounded-full">
          <Image
            src={profileImageSrc}
            alt="Profile"
            width={72}
            height={72}
            className="rounded-full object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Card: Basic Account Information --- */}
        <div className="lg:col-span-2 bg-white rounded-none border border-gray-200 p-6 shadow-xs">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b-2 border-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" /> Basic Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainInfo.map((item) => (
              <ProfileDetailItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* --- Card: Profile Details & Actions --- */}
        <div className="lg:col-span-1 space-y-8">
          {/* Security Card: Light Gray/Navy Vibe */}
          <div className="bg-slate-50 border border-slate-200 rounded-none p-6 flex flex-col items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
              Account Control
            </h3>

            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              {/* Edit Profile Button: Deep Gray */}
              <button
                onClick={() => setIsEditOpen(true)}
                className="bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-none hover:bg-gray-300 transition duration-200 flex items-center justify-center space-x-1 border border-gray-300"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              {/* Change Password Button: Solid Navy Blue/Black */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-none hover:bg-black transition duration-200 flex items-center justify-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center font-medium leading-relaxed">
              Maintain workspace integrity by reviewing details and rotating credentials regularly.
            </p>
          </div>

          {/* Profile Details Card */}
          <div className="bg-white rounded-none border border-gray-200 p-6 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b-2 border-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" /> System Details
            </h2>
            <div className="space-y-4">
              {profileInfo.map((item) => (
                <ProfileDetailItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditProfileDialog open={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
};

export default MyProfile;