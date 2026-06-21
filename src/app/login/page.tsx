"use client";

import { userLogin } from "@/components/Authentication/userLogin";
import { setToken, setUserInfo } from "@/components/Redux/Slice/authSlice";
import { useAppDispatch } from "@/components/Redux/hooks";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    const toastId = toast.loading("Login Processing !");

    try {
      const res = await userLogin(data);
      // console.log("login res", res);
      // Adjust for API response structure
      const userData = res?.data;
      // console.log("user res", userData);
      if (userData?.token) {
        dispatch(setToken({ accessToken: userData.token }));
        dispatch(
          setUserInfo({
            email: userData.admin.email,
            name: userData.admin.name,
            email_verified: true,
            role: userData.admin.role,
            profile: userData.admin.profile_picture
          })
        );
        reset();
        toast.success(res?.message || "Login Successfully", { id: toastId, duration: 2000 });
        setLoading(false);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(
          res?.message || "Valid Information Provide!",
          { id: toastId, duration: 2000 }
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 md:px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md lg:max-w-lg py-10 md:py-14 mx-auto flex justify-center items-center rounded-none lg:rounded-2xl overflow-hidden"
      >
        <div className="w-full px-2 md:px-4">
          <div className="w-full mx-auto space-y-6 bg-gray-50 rounded-none shadow-md p-3 md:p-6">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src={`/logo.png`}
                alt="logo-dg"
                height={80}
                width={250}
                className="h-auto w-auto max-h-20 md:max-h-24"
              />
            </div>

            {/* Admin Panel */}
            <p className="text-red-600 text-center mt-2 mb-6 font-semibold text-sm tracking-widest">
              ADMIN PANEL
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={"admin@gmail.com"}
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  required
                  className="w-full h-12 md:h-14 px-4 text-base md:text-lg border border-gray-300 rounded-none bg-white 
              focus:ring-2 focus:ring-primary focus:border-primary 
              placeholder-gray-500 focus:placeholder-gray-400 shadow-xs text-black transition"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  defaultValue={"admin@gmail.com"}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  required
                  className="w-full h-12 md:h-14 px-4 text-base md:text-lg border border-gray-300 rounded-none bg-white 
              focus:ring-2 focus:ring-primary focus:border-primary 
              placeholder-gray-500 focus:placeholder-gray-400 shadow-xs text-black transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary/80 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 md:h-14 flex items-center justify-center text-white text-base md:text-lg font-semibold rounded-none shadow-md 
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 
                  0 5.373 0 12h4zm2 
                  5.291A7.962 7.962 0 014 12H0c0 
                  3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>
            {/* Register Link */}
            <div className="text-center pt-2 border-t border-gray-200 mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-red-600 hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
