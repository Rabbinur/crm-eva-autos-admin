import { Printer } from 'lucide-react';

const CurrentStockReportTable = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-slate-800">Damage Product Report</h2>
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
                            <th className="text-left py-3 px-4 font-semibold border-b">Company</th>
                            <th className="text-left py-3 px-4 font-semibold border-b">Product</th>
                            <th className="text-left py-3 px-4 font-semibold border-b">Pur Price</th>
                            <th className="text-left py-3 px-4 font-semibold border-b">Stock Qty</th>
                            <th className="text-left py-3 px-4 font-semibold border-b">Stock Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Empty state or data rows would go here */}
                        <tr className="text-sm font-bold text-slate-800">
                            <td colSpan={4} className="py-4 px-4">Total:</td>
                            <td className="py-4 px-4">0</td>
                            <td className="py-4 px-4 text-right pr-8">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CurrentStockReportTable;