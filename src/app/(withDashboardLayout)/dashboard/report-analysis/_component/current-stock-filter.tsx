import { ChevronDown } from 'lucide-react';

const CurrentStockFilter = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
                <label className="text-sm font-medium text-slate-600">Select Company</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-md py-2.5 px-4 pr-10 text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <option>Select an option</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="md:col-span-4 space-y-2">
                <label className="text-sm font-medium text-slate-600">Select Category</label>
                <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-md py-2.5 px-4 pr-10 text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <option>Select an option</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="md:col-span-3">
                <button className="w-full bg-[#2D49FF] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md tracking-wider transition-colors">
                    REPORTS
                </button>
            </div>
        </div>
    );
};

export default CurrentStockFilter;