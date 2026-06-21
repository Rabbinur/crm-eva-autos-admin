// //@ts-nocheck
// "use client";

// import { sidebarMenu } from "@/constants/sidebarData";
// import { cn } from "@/lib/utils";
// import { Menu, User, X } from "lucide-react";
// import Image from "next/image";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { useAppSelector } from "../Redux/hooks";
// import { useCurrentUserInfo } from "../Redux/Slice/authSlice";

// import {
//   SidebarDropdown,
//   SidebarDropdownItem,
//   SidebarMenuItem,
// } from "./sidebar-menu-item";
// import Link from "next/link";
// export function Sidebar({ open, collapsed, onToggle, onCollapse }) {
//   const [expandedMenu, setExpandedMenu] = useState<string | null>("");
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const role = searchParams.get("role");
//   const user = useAppSelector(useCurrentUserInfo);

//   // console.log({ user })
//   const toggleMenu = (menu: string) => {
//     setExpandedMenu(expandedMenu === menu ? null : menu);
//   };

//   // ✅ Role-based active check
//   const isActive = (href: string) => {
//     // For non-role-based routes
//     if (!href.includes("admin-management")) {
//       return pathname === href;
//     }
//     // For role-based User Management routes
//     if (href.includes("role=") && role) {
//       return href.includes(`role=${role}`);
//     }
//     return false;
//   };

//   // ✅ Auto-expand User Management when role exists
//   const isUserManagementActive =
//     pathname.includes("/dashboard/admin-management") && role;

//   return (
//     <div className="flex flex-col">




//       {/* Mobile Toggle */}
//       <button
//         onClick={onToggle}
//         className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-none border border-border"
//       >
//         {open ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed md:relative h-screen p t-2 bg- sidebar bg-black [#2a2d2a] text-white transition-all duration-300  border-r border-sidebar-border flex flex-col transition-all duration-300 z-40",
//           open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
//           collapsed ? "w-20" : "w-72"
//         )}
//       >
//         {/* Logo Section */}
//         <div
//         className={cn(
//           "flex items-center justify-between bg-white transition-all duration-300",
//           collapsed ? "p -3" : "p-2 border-b border-sidebar-border"
//         )}
//       >
//         {!collapsed && (
//           <Link href={`/dashboard/`}>
//             <div className="p-2 md:p-3">
//               <Image
//                 src={"/logo.png"}
//                 alt="logo"
//                 width={200}
//                 height={20}
//                 className="mx-auto w-20 md:w- 40 lg:w- 48 xl:w- 52 h-auto"
//               />
//             </div>
//           </Link>
//         )}
//       </div>
//         {collapsed && (
//           <div className="">
//             <Image
//               src={"/fav.png"}
//               alt="logo"
//               width={40}
//               height={40}
//               className="mx-auto rounded-full w-8 h-8"
//             />
//           </div>
//         )}
//         {/* Profile */}
//         <div className="flex flex-col hidden items-center mb-8">
//           <div className="w-18 h-18  relative bg-white rounded-full flex overflow-hidden items-center justify-center mb-4 shadow-lg">

//             {user?.profile ? <div className="p-1"> <Image src={user?.profile} width={100} height={100} alt="" ></Image></div> : <User size={40} className="text-blue-900" />}
//           </div>
//           {open && (
//             <div className="text-center">
//               <h2 className="font-bold text-lg">  Hello, {user?.name || "User"}</h2>
//               <p className="text-sm text-blue-100"> {user?.role}</p>
//             </div>
//           )}
//         </div>

//         <nav className="flex-1  pt-5 overflow-y-auto p-2 px-5 space-y-2">
//           {sidebarMenu.map((menu) =>
//             menu.type === "dropdown" ? (
//               <SidebarDropdown
//                 key={menu.id}
//                 icon={menu.icon}
//                 label={menu.label}
//                 collapsed={collapsed}
//                 expanded={
//                   expandedMenu === menu.key ||
//                   (menu.label === "User Management" && isUserManagementActive)
//                 }
//                 onToggle={() => toggleMenu(menu.key)}
//               >
//                 {menu.items?.map((item) => (
//                   <div className="mx-2" key={item.href}>
//                     <SidebarDropdownItem
//                       href={item.href}
//                       label={item.label}
//                       isActive={isActive(item.href)}
//                     />
//                   </div>
//                 ))}
//               </SidebarDropdown>
//             ) : (
//               <SidebarMenuItem
//                 key={menu.id || menu.key}
//                 icon={menu.icon}
//                 label={menu.label}
//                 href={menu.href}
//                 collapsed={collapsed}
//                 isActive={isActive(menu.href ?? "")}
//               />
//             )
//           )}
//         </nav>
//       </aside>
//     </div>
//   );
// }



// //@ts-nocheck
// "use client";

// import { sidebarMenu } from "@/constants/sidebarData";
// import { cn } from "@/lib/utils";
// import { Menu, User, X } from "lucide-react";
// import Image from "next/image";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { useAppSelector } from "../Redux/hooks";
// import { useCurrentUserInfo } from "../Redux/Slice/authSlice";

// import {
//   SidebarDropdown,
//   SidebarDropdownItem,
//   SidebarMenuItem,
// } from "./sidebar-menu-item";
// import Link from "next/link";

// export function Sidebar({ open, collapsed, onToggle }) {
//   const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const role = searchParams.get("role");
//   const user = useAppSelector(useCurrentUserInfo);

//   const toggleMenu = (menu: string) => {
//     setExpandedMenu(expandedMenu === menu ? null : menu);
//   };

//   const isActive = (href: string) => {
//     if (href.includes("role=") && role) {
//       return href.includes(`role=${role}`);
//     }
//     return pathname === href;
//   };

//   const isUserManagementActive = pathname.includes("/dashboard/admin-management") && role;

//   return (
//     <div className="flex flex-col">
//       {/* Mobile Toggle */}
//       <button
//         onClick={onToggle}
//         className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md border border-zinc-200 text-[#001f3f]"
//       >
//         {open ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Sidebar - Light/White Background */}
//       <aside
//         className={cn(
//           "fixed md:relative h-screen bg-white transition-all duration-500 ease-in-out z-40 border-r border-zinc-200 flex flex-col shadow-sm",
//           open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
//           collapsed ? "w-20" : "w-72"
//         )}
//       >
//         {/* Logo Section */}
//         <div className={cn(
//           "flex items-center justify-center bg-white h-20 transition-all duration-300 border-b border-zinc-100",
//           collapsed ? "p-3" : "p-2"
//         )}>
//           {!collapsed ? (
//             <Link href="/dashboard">
//               <Image src="/logo.png" alt="logo" width={160} height={40} priority className="object-contain" />
//             </Link>
//           ) : (
//             <Image src="/fav.png" alt="logo" width={32} height={32} className="rounded-lg shadow-sm" />
//           )}
//         </div>

//         {/* Profile Card - Navy Blue Gradient */}
//         {!collapsed && user && (
//           <div className="p-4 mt-6 mx-4 rounded-2xl bg-gradient-to-br from-[#001f3f] to-[#003366] text-white shadow-lg shadow-blue-900/10">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-full border-2 border-white/20 p-0.5 overflow-hidden bg-white/10">
//                 {user?.profile ? (
//                   <Image src={user.profile} width={40} height={40} className="rounded-full object-cover" alt="p" />
//                 ) : (
//                   <User size={20} className="mx-auto mt-2 text-white" />
//                 )}
//               </div>
//               <div className="overflow-hidden">
//                 <p className="text-sm font-bold truncate tracking-tight">{user?.name || "Rabbinur"}</p>
//                 <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">{user?.role || "Developer"}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="flex-1 pt-6 overflow-y-auto px-4 space-y-2 custom-scrollbar">
//           {sidebarMenu.map((menu) =>
//             menu.type === "dropdown" ? (
//               <SidebarDropdown
//                 key={menu.id}
//                 icon={menu.icon}
//                 label={menu.label}
//                 collapsed={collapsed}
//                 expanded={expandedMenu === menu.key || (menu.label === "User Management" && isUserManagementActive)}
//                 onToggle={() => toggleMenu(menu.key)}
//               >
//                 {menu.items?.map((item) => (
//                   <SidebarDropdownItem
//                     key={item.href}
//                     href={item.href}
//                     label={item.label}
//                     isActive={isActive(item.href)}
//                   />
//                 ))}
//               </SidebarDropdown>
//             ) : (
//               <SidebarMenuItem
//                 key={menu.id}
//                 icon={menu.icon}
//                 label={menu.label}
//                 href={menu.href}
//                 collapsed={collapsed}
//                 isActive={isActive(menu.href ?? "")}
//               />
//             )
//           )}
//         </nav>
//       </aside>
//     </div>
//   );
// }


//@ts-nocheck
"use client";

import { sidebarMenu } from "@/constants/sidebarData";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { logOut, useCurrentUserInfo } from "../Redux/Slice/authSlice";
import { SidebarDropdown, SidebarDropdownItem, SidebarMenuItem } from "./sidebar-menu-item";
import { logoutUser } from "../Authentication/logoutUser";
import { toast } from "sonner";

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
}
export function Sidebar({ open, collapsed, onToggle }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const user = useAppSelector(useCurrentUserInfo);

  const handleLogOutUser = () => {
    logoutUser(router);
    dispatch(logOut());
    toast.success("Logged Out Successfully");
  };

  const toggleMenu = (menuKey: string) => {
    setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
  };

  const isActive = (href: string) => {
    if (href.includes("role=") && role) return href.includes(`role=${role}`);
    if (href === "/dashboard") return pathname === "/dashboard";
    if (pathname === href || pathname.startsWith(href + "/")) return true;
    
    // Handle specific plural/singular mappings for subpages
    if (href === "/dashboard/delivery/loading-sheets" && pathname.startsWith("/dashboard/delivery/loading-sheet")) return true;
    if (href === "/dashboard/delivery/settlements" && pathname.startsWith("/dashboard/delivery/settlement")) return true;
    
    return false;
  };

  // Update expandedMenu when pathname changes to auto-expand the active section
  useEffect(() => {
    const activeDropdown = sidebarMenu.find(
      (menu) =>
        menu.type === "dropdown" &&
        menu.items?.some((item) => isActive(item.href))
    );
    if (activeDropdown && activeDropdown.key) {
      setExpandedMenu(activeDropdown.key);
    }
  }, [pathname, role]);

  return (
    <div className="flex shadow  flex-col print:hidden">
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2.5 rounded-xl shadow-xl border border-slate-100 text-[#001f3f]"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          "fixed md:relative h-screen bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40 border-r border-slate-100 flex flex-col shadow-[10px_0_30px_-15px_rgba(0,0,0,0.04)]",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20" : "w-[280px]"
        )}
      >
        {/* Brand Header */}
        <div className="h-15 flex items-center justify-start border-b border-slate-300  shadow
        bg-white px-6">
          {!collapsed ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group"
            >
              {/* লোগো ইমেজ */}
              <Image
                src="/logo.png"
                alt="logo"
                width={40} // লোগো ছোট করে পাশে নাম রাখার জন্য width কমানো হয়েছে
                height={40}
                priority
                className="object-contain"
              />

              {/* ব্র্যান্ড নাম: Muktar's IT */}
              <div className="flex flex-col">
                <span className="text-[#001f3f] font-black text-xl tracking-tight leading-none uppercase">
                  Kamrul&apos;s
                </span>
                <span className="text-[#001f3f]/60 font-bold text-[12px] tracking-[0.2em] leading-none mt-1 uppercase">
                  Dealer
                </span>
              </div>
            </Link>
          ) : (
            <div className="bg-[#001f3f]/5 p-2 rounded-xl border border-[#001f3f]/10 shadow-sm transition-all hover:bg-[#001f3f]/10">
              <Image src="/fav.png" alt="fav" width={32} height={32} className="rounded-lg" />
            </div>
          )}
        </div>


        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar scroll-smooth">
          {sidebarMenu
            .filter((menu) => !(menu.key === "user-management" && user?.role === "moderator"))
            .map((menu) =>
              menu.type === "dropdown" ? (
              <SidebarDropdown
                key={menu.id}
                icon={menu.icon}
                label={menu.label}
                collapsed={collapsed}
                expanded={expandedMenu === menu.key}
                isActive={menu.items?.some((item) => isActive(item.href))}
                onToggle={() => toggleMenu(menu.key)}
              >
                {menu.items?.map((item) => (
                  <SidebarDropdownItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    isActive={isActive(item.href)}
                  />
                ))}
              </SidebarDropdown>
            ) : (
              <SidebarMenuItem
                key={menu.id}
                icon={menu.icon}
                label={menu.label}
                href={menu.href}
                collapsed={collapsed}
                isActive={isActive(menu.href ?? "")}
              />
            )
          )}
        </nav>


        {/* --- Sidebar Footer Section --- */}
        <div className="mt-auto border-t border-slate-100 bg-slate-50/50 p-4">

          {/* Logout Button */}
          <button
            onClick={handleLogOutUser}
            className={cn(
              "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 transition-all duration-300",
              "bg-transparent text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut size={20} className="z-10 transition-transform group-hover:scale-110" />
            {!collapsed && (
              <span className="z-10 whitespace-nowrap text-[13px] font-bold tracking-wide">
                Logout Account
              </span>
            )}
          </button>

          {/* Brand Signature */}
          {!collapsed && (
            <div className="mt-4 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300">
                Powered by <span className="text-[#001f3f]/50 text-xs italic">Muktar&apos;s IT</span>
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}