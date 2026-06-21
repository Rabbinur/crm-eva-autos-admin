"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Calendar,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const DailySaleList = () => {
  // ১. ফেক ডেটা (Fake Data)
  const salesData = [
    { id: 1, date: "2026-04-08", area: "Mirpur", staff: "Rabbinur", invoice: "INV-1001", qty: 45, amount: 25000, return: 0, damage: 2, damageVal: 1200, collection: 23800, status: "Completed" },
    { id: 2, date: "2026-04-07", area: "Uttara", staff: "Ariful", invoice: "INV-1002", qty: 30, amount: 18000, return: 500, damage: 0, damageVal: 0, collection: 17500, status: "Pending" },
    { id: 3, date: "2026-04-07", area: "Dhanmondi", staff: "Siam", invoice: "INV-1003", qty: 55, amount: 42000, return: 1200, damage: 5, damageVal: 3500, collection: 37300, status: "Completed" },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#001f3f] tracking-tight">
            Daily Sale <span className="text-blue-600">Records</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Total sales processed today: <span className="font-bold text-blue-600">03</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Download size={20} />
          </button>
          <Link href="/dashboard/create-sale">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-[#001f3f] text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-900/20 transition-all"
            >
              <Plus size={20} strokeWidth={3} />
              Create Sale
            </motion.button>
          </Link>
        </div>
      </div>

      {/* মেইন কন্টেইনার */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* টেবিল ফিল্টার এবং সার্চ */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search invoice or staff..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 w-full md:w-80 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all">
              <Filter size={16} /> Filter
            </button>
          </div>
          
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Showing 1-10 of 45 Entries
          </div>
        </div>

        {/* সেলস টেবিল */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">SL</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Date</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Area & Staff</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Invoice</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Qty</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Total Amount</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Returns</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Collection</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {salesData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-6 py-5 text-sm font-bold text-slate-300">{idx + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <Calendar size={14} className="text-blue-500" />
                      {item.date}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-black text-[#001f3f] text-sm">{item.area}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{item.staff}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black border border-blue-100">
                      {item.invoice}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-slate-600">{item.qty}</td>
                  <td className="px-6 py-5 text-right font-black text-[#001f3f]">{item.amount.toLocaleString()} ৳</td>
                  <td className="px-6 py-5 text-center font-bold text-red-400">{item.return} ৳</td>
                  <td className="px-6 py-5 text-right font-black text-emerald-600">{item.collection.toLocaleString()} ৳</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18}/></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* প্যাগিনেশন */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#001f3f] transition-all">
            <ChevronLeft size={18}/> Previous
          </button>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(page => (
              <button key={page} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                page === 1 ? 'bg-[#001f3f] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}>
                {page}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#001f3f] transition-all">
            Next <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailySaleList;