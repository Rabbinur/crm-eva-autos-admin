import React from 'react';
import { ChevronDown } from 'lucide-react';

const ProductFilters = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
      <div className="md:col-span-4 space-y-2">
        <label className="text-sm font-medium text-slate-600">
          Date Range <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          defaultValue="10-03-2026 - 08-04-2026"
          className="w-full bg-white border border-slate-200 rounded-md py-2.5 px-4 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="md:col-span-6 space-y-2">
        <label className="text-sm font-medium text-slate-600">
          Select Product <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select className="w-full appearance-none bg-white border border-slate-200 rounded-md py-2.5 px-4 pr-10 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>Darrel Mckay - 00000001</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="md:col-span-2">
        <button className="w-full bg-[#2D49FF] hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md tracking-wider transition-colors overflow-hidden whitespace-nowrap">
          REPORTS
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;