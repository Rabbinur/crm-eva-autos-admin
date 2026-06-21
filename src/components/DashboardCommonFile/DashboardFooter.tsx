"use client";

import { motion } from "framer-motion";
import { Globe, Heart, Zap } from "lucide-react";

export const DashboardFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full px-6 py-4 mt-auto">
            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] px-6 py-3">

                {/* Background Glows */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#001f3f]/5 rounded-full blur-3xl" />

                <div className="relative flex flex-row items-center justify-between gap-4">

                    {/* Left: Branding & Status Combined */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                            <div className="w-2 h-2 rounded-full bg-[#001f3f] animate-pulse" />
                            <span className="text-[#001f3f] font-black text-sm tracking-tight uppercase">
                                Kamrul&apos;s <span className="text-blue-600">Dealer</span>
                            </span>
                        </div>
                        <p className="hidden md:block text-slate-400 text-[11px] font-medium tracking-wide">
                            {currentYear} © All Rights Reserved.
                        </p>
                    </div>

                    {/* Center: Minimalist Badge */}
                    <div className="hidden lg:flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                        <Heart size={12} className="text-rose-500 fill-rose-500 animate-bounce" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Premium Dashboard</span>
                    </div>

                    {/* Right: Enhanced Developer Button */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dev by</span>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-[#001f3f] rounded-xl blur-sm opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative flex items-center gap-2.5 bg-[#001f3f] px-4 py-1.5 rounded-xl border border-white/20 shadow-md overflow-hidden">
                                {/* Moving Shine Effect */}
                                <motion.div
                                    initial={{ x: "-150%" }}
                                    animate={{ x: "150%" }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 2 }}
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                                />
                                <Zap size={12} className="text-blue-400 fill-blue-400" />
                                <span className="text-white font-bold text-xs tracking-tight">Muktar&apos;s <span className="text-blue-400">IT</span></span>
                                <Globe size={12} className="text-white/70 group-hover:rotate-12 transition-transform" />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </footer>
    );
};