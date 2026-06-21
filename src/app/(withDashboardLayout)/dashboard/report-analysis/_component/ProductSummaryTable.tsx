import React from 'react';
import { Printer } from 'lucide-react';

const ProductSummaryTable = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-slate-800">
          Product Summery 10-03-2026 To 08-04-2026
        </h2>
        <button className="flex items-center gap-2 bg-[#00B5B5] hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm transition-colors">
          <Printer size={16} />
          Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E9ECEF] text-slate-700 text-sm">
              <th className="text-left py-3 px-4 font-semibold border-b">SL</th>
              <th className="text-left py-3 px-4 font-semibold border-b">Date</th>
              <th className="text-left py-3 px-4 font-semibold border-b">Details</th>
              <th className="text-left py-3 px-4 font-semibold border-b">In</th>
              <th className="text-left py-3 px-4 font-semibold border-b">Out</th>
              <th className="text-left py-3 px-4 font-semibold border-b">Current Stock</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            <tr className="border-b border-slate-100">
              <td className="py-4 px-4">1</td>
              <td className="py-4 px-4">08-04-2026 05:59 PM</td>
              <td className="py-4 px-4 text-center">Opening Stock</td>
              <td className="py-4 px-4">4,301</td>
              <td className="py-4 px-4"></td>
              <td className="py-4 px-4 font-bold text-right pr-8">4,301</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Large Stock Counter */}
      <div className="flex justify-center items-center py-6">
        <h3 className="text-4xl font-bold text-slate-800 flex items-center gap-4">
          Current Stock = <span className="text-[#FF5C5C]">4,301</span>
        </h3>
      </div>
    </div>
  );
};

export default ProductSummaryTable;