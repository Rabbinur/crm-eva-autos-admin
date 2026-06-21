import { ChevronDown, KeyRound, Settings, UserPen } from "lucide-react";
import { useAppSelector } from "../Redux/hooks";
import { RootState } from "../Redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const DashboardSidebarNested = () => {
  const isSidebarOpen = useAppSelector(
    (state: RootState) => state.sidebar.isOpen
  );
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={`${isSidebarOpen ? " w-48" : ""}`}>
          <div
            className={`w-full  flex justify-between items-center gap-2 p-2.5 rounded-none cursor-pointer transition-all duration-300 hover:bg-primary/75 hover:text-white text-gray-700 ${isSidebarOpen ? "" : ""
              }`}
          >
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <Settings size={20} />
                <span>Settings</span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="">
                  <Settings size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" bg-red-300 border shadow-none">
                  <DropdownMenuItem className=" cursor-pointer ">
                    <UserPen size={20} />
                    <p>Edit Profile</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" cursor-pointer">
                    <KeyRound size={20} />
                    <p>Change Password</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isSidebarOpen && <ChevronDown size={20} />}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-48 bg-white border shadow-none">
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
    </div>
  );
};

export default DashboardSidebarNested;
