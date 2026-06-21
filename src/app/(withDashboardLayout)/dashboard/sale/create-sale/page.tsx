"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  Save, 
  List, 
  Search, 
  Trash2,
  Calendar,
  User,
  MapPin,
  Hash
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const CreateDailySale = () => {
  // ১. বর্তমান তারিখ বের করার ফাংশন (YYYY-MM-DD ফরম্যাট)
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ২. প্রাথমিক স্টেট (Initial State)
  const initialState = {
    invoiceNo: "INV-1775628074",
    saleDate: getTodayDate(), // এখানে এখন সব সময় আজকের তারিখ বসবে
    staffName: "",
    routeName: "",
    company: "",
    product: "",
    notes: ""
  };

  const [formData, setFormData] = useState(initialState);

  // ৩. রিসেট ফাংশন (রিসেট করলেও বর্তমান তারিখ বজায় থাকবে)
  const handleReset = () => {
    if(confirm("Are you sure you want to clear all fields?")) {
      setFormData({
        ...initialState,
        saleDate: getTodayDate() 
      });
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      {/* হেডার এবং অ্যাকশন বাটন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#001f3f] tracking-tight">
            Create <span className="text-blue-600">Daily Sale</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage your daily transactions with real-time tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sale List এ যাওয়ার বাটন */}
          <Link href="/dashboard/sale-list">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all"
            >
              <List size={18} />
              Sale List
            </motion.button>
          </Link>
          
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#001f3f] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </motion.button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 md:p-10">
        {/* ফর্ম ইনপুট গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Invoice No */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <Hash size={14}/> Invoice No
            </label>
            <input 
              type="text"
              value={formData.invoiceNo} 
              readOnly 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#001f3f] cursor-not-allowed"
            />
          </div>

          {/* Sale Date (আজকের তারিখ অটোমেটিক থাকবে) */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <Calendar size={14}/> Sale Date
            </label>
            <input 
              type="date"
              value={formData.saleDate}
              onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-[#001f3f]"
            />
          </div>

          {/* Staff Name */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <User size={14}/> Staff Name
            </label>
            <select 
              value={formData.staffName}
              onChange={(e) => setFormData({...formData, staffName: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-[#001f3f] appearance-none"
            >
              <option value="">Select Staff</option>
              <option value="1">Md. Rabbinur</option>
            </select>
          </div>

          {/* Route Name */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <MapPin size={14}/> Route Name
            </label>
            <select 
              value={formData.routeName}
              onChange={(e) => setFormData({...formData, routeName: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-[#001f3f] appearance-none"
            >
              <option value="">Select Route</option>
              <option value="1">Mirpur Zone</option>
            </select>
          </div>
        </div>

        {/* প্রোডাক্ট সিলেকশন এরিয়া */}
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-3">
               <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Company</label>
               <select className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-[#001f3f]">
                 <option>Choose Company</option>
               </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Product</label>
                <select className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-[#001f3f]">
                  <option>Select Company First</option>
                </select>
              </div>
              <button className="bg-cyan-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all flex items-center gap-2 self-end">
                <Search size={18} /> Get
              </button>
            </div>
          </div>
        </div>

        {/* ক্যালকুলেশন টেবিল */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 mb-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#001f3f] text-white">
              <tr>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Dis</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-center">Subtotal</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="bg-blue-50/30">
                <td colSpan={4} className="px-6 py-6 font-black text-[#001f3f] text-xl text-right uppercase tracking-widest">Total Amount</td>
                <td className="px-6 py-6 font-black text-blue-600 text-xl text-center">0.00</td>
                <td className="px-6 py-6 text-right">
                  <button className="p-2 text-slate-300"><Trash2 size={18}/></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* নোট এবং ফাইনাল অ্যাকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
          <div className="lg:col-span-2 space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Notes</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional sales info..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all resize-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* রিসেট বাটন (Reset Functionality) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-5 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all"
            >
              <RotateCcw size={20} /> Reset
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-5 rounded-2xl font-bold text-white bg-emerald-500 shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              <Save size={20} /> Save Sale
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDailySale;