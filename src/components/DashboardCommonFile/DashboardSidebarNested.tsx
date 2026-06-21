"use client";
import { ChevronDown, KeyRound, Settings, UserPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../Redux/hooks";
import { RootState } from "../Redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const DashboardSidebarNested = () => {
  const isSidebarOpen = useAppSelector(
    (state: RootState) => state.sidebar.isOpen
  );
  const [isCustomDropdownOpen, setCustomDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleCustomDropdown = () => {
    setCustomDropdownOpen(!isCustomDropdownOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCustomDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      {isSidebarOpen ? (
        <DropdownMenu>
          <DropdownMenuTrigger className={`${isSidebarOpen ? " w-52" : ""}`}>
            <div
              className={`w-full  flex justify-between items-center gap-2 p-1.5 md:p-2.5 rounded-none cursor-pointer transition-all duration-300 dark:bg-slate-800 dark:text-white  hover:bg-primary/75 hover:text-white text-gray-700 ${isSidebarOpen ? "" : ""
                }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={20} />
                <span>Settings</span>
              </div>
              {isSidebarOpen && <ChevronDown size={20} />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" w-52 bg-white dark:bg-slate-800 dark:text-white border shadow-none">
            <DropdownMenuItem className=" cursor-pointer">
              <UserPen size={20} />
              <p>Edit Profile</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              {" "}
              <KeyRound size={20} />
              <p>Change Password</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div ref={dropdownRef}>
          <div
            className="flex justify-center items-center gap-2 p-1.5 md:p-2.5 rounded-none cursor-pointer transition-all duration-300  hover:bg-primary/75 hover:text-white text-gray-700"
            onClick={toggleCustomDropdown}
          >
            <Settings size={20} />
          </div>
          {isCustomDropdownOpen && (
            <div className="absolute mt-2">
              <div className="flex flex-col space-y-2 bg-gray-100 rounded-xl">
                <div className="  p-2.5 rounded-none cursor-pointer transition-all duration-300  hover:bg-primary/75 hover:text-white text-gray-700">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <UserPen size={20} className="cursor-pointer " />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className=" ml-2"
                      >
                        Edit Profile
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="  p-2.5 rounded-none cursor-pointer transition-all duration-300  hover:bg-primary/75 hover:text-white text-gray-700">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <KeyRound size={20} className="cursor-pointer " />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="center"
                        className=" ml-2"
                      >
                        Change Password
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardSidebarNested;
