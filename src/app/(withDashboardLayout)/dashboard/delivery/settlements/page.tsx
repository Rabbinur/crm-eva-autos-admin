'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetSettlementsQuery } from '@/components/Redux/RTK/distributorApiNode';
import SettlementsTab from '../_components/SettlementsTab';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { addDays, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import CustomDateRangePicker from '../../report-analysis/_component/CustomDateRangePicker';

const formatCurrency = (val: number) => `৳${val.toFixed(2)}`;

export default function SettlementsPage() {
  const [dateRangeType, setDateRangeType] = useState('all');
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [openPicker, setOpenPicker] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sync date selection with formatted start/end strings
  useEffect(() => {
    let start = '';
    let end = '';
    const today = new Date();

    switch (dateRangeType) {
      case 'today':
        start = format(today, 'yyyy-MM-dd');
        end = format(today, 'yyyy-MM-dd');
        break;
      case 'monthly':
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'quarterly':
        start = format(subMonths(today, 3), 'yyyy-MM-dd');
        end = format(today, 'yyyy-MM-dd');
        break;
      case 'yearly':
        start = format(startOfYear(today), 'yyyy-MM-dd');
        end = format(endOfYear(today), 'yyyy-MM-dd');
        break;
      case 'custom':
        start = format(range[0].startDate, 'yyyy-MM-dd');
        end = format(range[0].endDate, 'yyyy-MM-dd');
        break;
      case 'all':
      default:
        start = '';
        end = '';
    }

    setStartDate(start);
    setEndDate(end);
  }, [dateRangeType, range]);

  const queryParams = useMemo(() => {
    return {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };
  }, [startDate, endDate]);

  const { data: responseData, isLoading } = useGetSettlementsQuery(queryParams);

  const settlements = responseData?.data || [];
  const summary = responseData?.summary || { totalSales: 0, totalProfit: 0, totalLoss: 0 };

  const formattedRange = `${format(range[0].startDate, 'MMM d, yyyy')} - ${format(
    range[0].endDate,
    'MMM d, yyyy'
  )}`;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#001f3f] tracking-tight">Daily Settlements</h1>
          <p className="mt-1 text-muted-foreground">
            Track representative sales, returned stock, damages, and net profit
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Date Filter</span>
            <Select value={dateRangeType} onValueChange={setDateRangeType}>
              <SelectTrigger className="w-[140px] rounded-xl border-slate-200">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRangeType === 'custom' && (
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-slate-200"
                onClick={() => setOpenPicker(!openPicker)}
              >
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formattedRange}</span>
              </Button>
              {openPicker && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <CustomDateRangePicker
                    range={range}
                    setRange={setRange}
                    onClose={() => setOpenPicker(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <Card className="bg-gradient-to-tr from-[#f8fafc] to-[#eff6ff] border border-blue-100/50 shadow-sm rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Sales Revenue</span>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                ) : (
                  formatCurrency(summary.totalSales)
                )}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Accumulated representative sales</p>
            </div>
            <div className="p-4 bg-blue-100/60 text-blue-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="bg-gradient-to-tr from-[#f8fafc] to-[#f0fdf4] border border-green-100/50 shadow-sm rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Total Net Profit</span>
              <h3 className={`text-3xl font-black tracking-tight ${summary.totalProfit >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-emerald-600" />
                ) : (
                  formatCurrency(summary.totalProfit)
                )}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Gross sales profit minus damage loss</p>
            </div>
            <div className="p-4 bg-green-100/60 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>

        {/* Damage Loss */}
        <Card className="bg-gradient-to-tr from-[#f8fafc] to-[#fdf2f2] border border-rose-100/50 shadow-sm rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Total Damage Loss</span>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {isLoading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-rose-600" />
                ) : (
                  formatCurrency(summary.totalLoss)
                )}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Cost value of damaged items</p>
            </div>
            <div className="p-4 bg-rose-100/60 text-rose-600 rounded-2xl">
              <TrendingDown size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settlements Table */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[300px]">
          <Loader2 className="animate-spin h-8 w-8 text-primary mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Loading settlements details...</p>
        </div>
      ) : (
        <SettlementsTab settlements={settlements} />
      )}
    </div>
  );
}
