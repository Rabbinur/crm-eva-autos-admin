
"use client"

import DashboardHeader from "@/components/DashboardCommonFile/DahsboardHeader";
import { DashboardFooter } from "@/components/DashboardCommonFile/DashboardFooter";
import { Sidebar } from "@/components/DashboardCommonFile/DashboardSidebar";
import { useState } from "react";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onCollapseClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />

        {/* Scrollable Container with Flex Column */}
        <main className="flex-1 overflow-y-auto flex flex-col  transition-colors duration-300">
          
         
          <div className="flex-1">
            {children}
          </div>

      
          <DashboardFooter />
          
        </main>
      </div>
    </div>
  )
}