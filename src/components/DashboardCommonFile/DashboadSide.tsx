"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { Sidebar } from "./DashboardSidebar";



const DashboardSide = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className="h-screen bg-white border-r border-gray-300   dark:bg-slate-900 sticky top-0 z-50 w-60">
      <Link href={`/dashboard/`}>
        <div className=" p-2 md:p-3 border-b">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={200}
            height={80}
            className="mx-auto 
                  w-36 md:w-40 lg:w-48 xl:w-52 
                 h-auto"
          />
        </div>
      </Link>

      <div className="  h-full space-y-1.5 md:space-y-2 rounded-none 
      transition-all duration-300 w- 60 px-3 md:px-4 py-2 md:py-3">

        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

      </div>
    </div>
  );
};

export default DashboardSide;
