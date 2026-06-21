"use client";
import { useChangePasswordMutation } from "@/components/Redux/RTK/authApi";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// ✅ Error extractor
const getErrorMessage = (error: any): string => {
  if (error?.data?.message) return error.data.message;
  if (error?.status === "FETCH_ERROR")
    return "Network error or server is unreachable.";
  return "An unknown error occurred.";
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [changePassword, { isLoading, isError, error, isSuccess, reset }] =
    useChangePasswordMutation();

  // ✅ Reset on modal open/close
  useEffect(() => {
    if (isOpen) reset();
    if (!isOpen || isSuccess) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLocalError(null);
    }
  }, [isOpen, isSuccess, reset]);

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLocalError(null);

  //   if (newPassword !== confirmPassword) {
  //     setLocalError("New passwords don't match. Please check your typing.");
  //     return;
  //   }
  //   if (newPassword.length < 8) {
  //     setLocalError("New password must be at least 8 characters long.");
  //     return;
  //   }


  // try {
  //   const res = await changePassword({
  //     current_password: oldPassword,
  //     new_password: newPassword,
  //     new_password_confirmation: confirmPassword,
  //   }).unwrap();


  //   if (res?.status_code === 200) {
  //     setTimeout(() => {
  //       onClose();
  //     }, 1500);
  //   }
  // } catch (err) {
  //   console.error("Password change failed:", err);
  // }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (newPassword !== confirmPassword) {
      setLocalError("New passwords don't match. Please check your typing.");
      return;
    }
    if (newPassword.length < 8) {
      setLocalError("New password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await changePassword({
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }).unwrap();

      if (res?.status_code === 200) {
        // ✅ Success Toast
        toast.success(res?.Message || "Password changed successfully! 🎉", {
          position: "top-center",
        });

        // ✅ Auto-close after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // ❌ Error Toast
        toast.error(
          res?.Message || res?.error?.errMsg || "Something went wrong.",
          { position: "top-center" }
        );
      }
    } catch (err: any) {
      console.error("Password change failed:", err);
      toast.error(
        err?.data?.Message || err?.data?.error?.errMsg || "An error occurred.",
        { position: "top-center" }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-3">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* --- Header --- */}
        <div className="flex justify-between items-start mb-6 border-b pb-3">
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-primary" /> Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- Success --- */}
        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-700 font-semibold text-xl mb-4">
              Password changed successfully! 🎉
            </p>
            <p className="text-gray-600 mb-6">
              Your account is now more secure.
            </p>
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-none transition duration-200 shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          /* --- Form --- */
          <form onSubmit={handleSubmit}>
            {[
              {
                label: "Current Password",
                id: "old" as const,
                value: oldPassword,
                onChange: setOldPassword,
              },
              {
                label: "New Password",
                id: "new" as const,
                value: newPassword,
                onChange: setNewPassword,
              },
              {
                label: "Confirm New Password",
                id: "confirm" as const,
                value: confirmPassword,
                onChange: setConfirmPassword,
              },
            ].map(({ label, id, value, onChange }) => (
              <div key={id} className="mb-5">
                <label
                  className=" text-gray-700 text-sm font-semibold mb-2 flex items-center"
                  htmlFor={id}
                >
                  <Key className="w-4 h-4 mr-2 text-indigo-500" /> {label}
                </label>
                <div className="relative">
                  <input
                    type={showPassword[id] ? "text" : "password"}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className={`border rounded w-full py-2 px-3 pr-10 text-gray-800 focus:ring-2 focus:ring-indigo-500 shadow-inner ${isLoading ? "bg-gray-100" : "bg-white"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(id)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary"
                  >
                    {showPassword[id] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {id === "new" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 characters.
                  </p>
                )}
              </div>
            ))}

            {/* --- Error --- */}
            {(localError || isError) && (
              <div className="flex items-center text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded my-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <p>{localError || getErrorMessage(error)}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className=" bg-primary text-white font-semibold py-2 px-4 rounded-none flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Saving...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
