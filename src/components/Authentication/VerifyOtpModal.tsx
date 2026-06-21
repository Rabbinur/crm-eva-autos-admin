"use client";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useVerifyAdminOTPMutation,
  useResendAdminOTPMutation,
} from "../Redux/RTK/authApiNode";
import { setToken, setUserInfo } from "../Redux/Slice/authSlice";
import { useAppDispatch } from "../Redux/hooks";
import { Dialog, DialogContent } from "../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { userLogin } from "./userLogin";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: { email: string; password: string } | null;
}

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  isOpen,
  onClose,
  loginData,
}) => {
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendVerifyAuthOtp, { isLoading: resending }] =
    useResendAdminOTPMutation();
  const [verifyAuthOtp, { isLoading }] = useVerifyAdminOTPMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [otpLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimer(120);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    setValue("");
    setTimer(120);
    const resendData = {
      email: loginData?.email,
    };

    try {
      const response: any = await resendVerifyAuthOtp(resendData);
      console.log("OTP Response", response);
      if (response?.data?.success) {
        toast.success(response?.data?.message || "OTP resent successfully", {
          id: toastId,
          duration: 2000,
        });
      } else {
        const errMsg = response?.error?.data?.message || response?.data?.message || "OTP resend failed.";
        toast.error(errMsg, {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to resend OTP.", { id: toastId });
    }
  };

  const handleOtpChange = (otp: string) => {
    setValue(otp);
    if (otp.length === 6) {
      handleVerifyOtp(otp);
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const codeToVerify = otpValue || value;
    if (!codeToVerify || codeToVerify.length !== 6) return;

    const toastId = toast.loading("Verification Processing...");
    setLoading(true);
    if (!loginData?.email) {
      setLoading(false);
      toast.error("User email is missing.", { id: toastId });
      return;
    }

    if (!loginData) {
      setLoading(false);
      toast.error("Login data is missing.", { id: toastId });
      return;
    }
    const verifyData = {
      email: loginData.email,
      otp: codeToVerify,
    };

    console.log("Verify Data", verifyData);
    try {
      const response: any = await verifyAuthOtp(verifyData);
      console.log("Verify Code Response", response);
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Verified successfully", {
          id: toastId,
          duration: 3000,
        });
        
        router.push("/login");
        onClose();
        setLoading(false);
      } else {
        const errorMsg = response?.error?.data?.message || response?.data?.message || "OTP verification failed.";
        toast.error(errorMsg, {
          id: toastId,
          duration: 2000,
        });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify OTP.", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[425px] opt-x p-6 bg-white rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col justify-center items-center text-center space-y-3">
          <Image
            src="https://cdn-icons-png.flaticon.com/128/9731/9731748.png"
            alt="OTP Security Icon"
            width={100}
            height={100}
            className="h-14 w-14"
          />
          <h1 className="text-xl font-bold text-gray-900">Verify Account</h1>
          <p className="text-gray-500 text-sm max-w-xs">
            We have sent a verification code to <span className="font-semibold text-gray-700">{loginData?.email}</span>.
          </p>
        </div>

        <div className="w-full flex flex-col justify-center items-center py-6 space-y-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onChange={handleOtpChange}
            value={value}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <div className="text-slate-400 font-bold text-lg px-0.5">-</div>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </div>
          </InputOTP>

          <div className="text-center text-sm">
            {timer > 0 ? (
              <p className="text-gray-500">
                Resend code in <strong className="text-red-600 font-semibold">{formatTime(timer)}</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-red-600 font-semibold hover:underline transition cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            disabled={isLoading || resending || otpLoading}
            onClick={() => handleVerifyOtp()}
            className="w-2/3 bg-red-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-700 transition"
          >
            {isLoading || otpLoading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
