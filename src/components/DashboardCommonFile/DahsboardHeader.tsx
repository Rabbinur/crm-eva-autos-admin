"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // ✅ sheet import
import { Menu, Power } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "../Authentication/logoutUser";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { logOut, useCurrentUserInfo } from "../Redux/Slice/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DashboardSide from "./DashboadSide";
interface HeaderProps {
  onMenuClick: () => void;
  onCollapseClick: () => void;
}
const DashboardHeader = ({ onMenuClick, onCollapseClick }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUserInfo);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log({ user })
  const handleLogOutUser = () => {
    logoutUser(router);
    dispatch(logOut());
    toast.success("Logged Out Successfully");
  };

  return (
    <div className="sticky top-0 z-50 print:hidden">
      <div className=" shadow bg-white py-2 px-4 flex items-center justify-between">
        {/* Left Side - Menu Button */}
        <div className="flex items-center gap-2">
          <Button
            // onClick={onMenuClick}
            variant={"outline"}
            onClick={onCollapseClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-none  transition-colors"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* ✅ Mobile menu */}

        <div className="md: hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-none hover:bg-secondary gray-100 ">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white  p-0 border-r">
              <DialogTitle className=" hidden">Mobile Sidebar</DialogTitle>

              <DashboardSide />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-3 2xl:gap-5 text-right">
            <div>
              <h1 className="text-base text-gray-800 ">
                Hello, {user?.name || "User"}
              </h1>
              <h1 className=" text-sm font-normal text-primary  capitalize">
                {user?.role}
              </h1>
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Avatar className="cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-slate-200">
              <AvatarImage src={user?.profile || "/user-vector.jpg"} className="object-cover" />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
            </Avatar>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg z-50 origin-top-right"
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                    {user?.name || "My Account"}
                  </div>
                  <div className="my-1 border-t border-slate-100" />
                  
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-sm font-semibold text-slate-700 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogOutUser();
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors mt-2"
                  >
                    <span>Log out</span>
                    <Power size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
