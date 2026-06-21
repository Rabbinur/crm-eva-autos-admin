"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Briefcase, FileText } from "lucide-react";
import { userRegister } from "@/components/Authentication/userRegister";
import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  designation?: string;
  bio?: string;
}

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [registeredData, setRegisteredData] = useState<{ email: string; password: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    const toastId = toast.loading("Processing registration...");

    try {
      const response = await userRegister(data);
      console.log("Registration response:", response);

      if (response?.success) {
        toast.success(response.message || "Registration successful! OTP sent to your email.", {
          id: toastId,
          duration: 3000,
        });
        
        // Save data to pass to the OTP verification modal
        setRegisteredData({
          email: data.email,
          password: data.password,
        });
        
        // Open the OTP Modal
        setIsOtpOpen(true);
      } else {
        toast.error(response?.message || "Registration failed. Please try again.", {
          id: toastId,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again later.", {
        id: toastId,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 md:px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md lg:max-w-lg mx-auto flex flex-col justify-center items-center"
      >
        <div className="w-full">
          <div className="w-full space-y-6 bg-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="logo"
                height={80}
                width={250}
                className="h-auto w-auto max-h-20 md:max-h-24"
                priority
              />
            </div>

            {/* Title */}
            <div>
              <p className="text-red-600 text-center mt-2 font-semibold text-sm tracking-widest uppercase">
                Register Admin Account
              </p>
              <h2 className="text-center text-gray-500 text-xs mt-1">
                Enter your details to register as an administrator
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", { required: "Full Name is required" })}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-300 rounded-lg bg-white 
                    focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none
                    placeholder-gray-400 text-black transition"
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
                )}
              </div>

              {/* Email Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-300 rounded-lg bg-white 
                    focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none
                    placeholder-gray-400 text-black transition"
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className="w-full h-12 pl-4 pr-12 text-sm border border-gray-300 rounded-lg bg-white 
                    focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none
                    placeholder-gray-400 text-black transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>
                )}
              </div>

              {/* Designation Input (Optional) */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Briefcase size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Designation (Optional)"
                  {...register("designation")}
                  className="w-full h-12 pl-11 pr-4 text-sm border border-gray-300 rounded-lg bg-white 
                    focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none
                    placeholder-gray-400 text-black transition"
                />
              </div>

              {/* Bio Input (Optional) */}
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">
                  <FileText size={18} />
                </span>
                <textarea
                  placeholder="Bio / Short Description (Optional)"
                  {...register("bio")}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg bg-white 
                    focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none
                    placeholder-gray-400 text-black transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 flex items-center justify-center text-white text-sm font-semibold rounded-lg shadow-md 
                  transition transform duration-300 ease-in-out
                  ${loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 active:bg-red-800 hover:scale-[1.01]"
                  }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "REGISTER NOW"
                )}
              </button>
            </form>

            {/* Already have an account */}
            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OTP Verification Modal */}
      {isOtpOpen && (
        <VerifyOtpModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          loginData={registeredData}
        />
      )}
    </div>
  );
};

export default RegisterPage;
