
"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function SidebarMenuItem({ icon, label, href, collapsed, isActive }: any) {
  return (
    <Link
      href={href || "#"}
      className={cn(
        "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden",
        isActive
          ? "bg-[#001f3f] text-white shadow-[0_10px_15px_-3px_rgba(0,31,63,0.3)]"
          : "text-slate-500 hover:text-[#001f3f] hover:bg-[#001f3f]/5",
        collapsed && "justify-center px-2"
      )}
    >
      <div className={cn(
        "flex-shrink-0 transition-transform duration-300 group-hover:scale-110 z-10",
        isActive ? "text-white" : "text-slate-400 group-hover:text-[#001f3f]"
      )}>
        {icon}
      </div>

      {!collapsed && (
        <span className="font-semibold text-[13.5px] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis z-10">
          {label}
        </span>
      )}

      {/* Subtle background glow for active item */}
      {isActive && (
        <motion.div
          layoutId="active-bg"
          className="absolute inset-0 bg-gradient-to-r from-[#001f3f] to-[#003366] z-0"
        />
      )}
    </Link>
  );
}

export function SidebarDropdown({ icon, label, collapsed, expanded, isActive, onToggle, children }: any) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 group",
          isActive
            ? "bg-[#001f3f]/5 text-[#001f3f] font-bold"
            : expanded
            ? "bg-slate-50 text-[#001f3f]"
            : "text-slate-500 hover:text-[#001f3f] hover:bg-slate-50",
          collapsed && "justify-center"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn(
            "flex-shrink-0 transition-all duration-300",
            isActive || expanded ? "text-[#001f3f] scale-110" : "text-slate-400 group-hover:text-[#001f3f]"
          )}>
            {icon}
          </div>
          {!collapsed && (
            <span className="font-bold text-[11px] uppercase tracking-[0.15em] whitespace-nowrap opacity-80">
              {label}
            </span>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-500 ease-in-out",
              expanded ? "rotate-180 text-[#001f3f]" : "opacity-40 group-hover:opacity-100",
              isActive && "text-[#001f3f]"
            )}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden ml-7 flex flex-col gap-1 border-l-2 border-slate-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SidebarDropdownItem({ href, label, isActive }: any) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-5 py-2 text-[13px] transition-all duration-300 rounded-r-lg group flex items-center whitespace-nowrap",
        isActive ? "text-[#001f3f] font-bold" : "text-slate-500 hover:text-[#001f3f]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="dropdown-dot"
          className="absolute left-[-2px] w-1 h-5 bg-[#001f3f] rounded-full shadow-[0_0_8px_rgba(0,31,63,0.4)]"
        />
      )}
      <span className={cn(
        "transition-transform duration-300 overflow-hidden text-ellipsis",
        !isActive && "group-hover:translate-x-1.5"
      )}>
        {label}
      </span>
    </Link>
  );
}