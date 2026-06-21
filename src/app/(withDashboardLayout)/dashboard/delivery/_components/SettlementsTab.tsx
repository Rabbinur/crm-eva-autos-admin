'use client';

import { Settlement } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  settlements: Settlement[];
};

export default function SettlementsTab({ settlements }: Props) {
  const router = useRouter();

  return settlements.length ? (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Voucher ID</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Date</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Delivery Representative</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Sold Qty</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Returned Qty</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Damaged Qty</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Sales Revenue</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Net Profit</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Damage Loss</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-center">Status</TableHead>
            <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-50">
          {settlements.map(s => (
            <TableRow key={s.id} className="hover:bg-blue-50/10 transition-colors">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary/70 shrink-0" />
                  <span className="font-mono font-bold text-foreground text-sm tracking-tight">{s.invoiceNo || s.id.slice(-8).toUpperCase()}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Calendar size={13} className="text-primary/70 shrink-0" />
                  <span>{s.date}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-[#001f3f] text-sm">
                {s.deliveryManName}
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-medium text-slate-600">
                {s.totalSold} pcs
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-medium text-slate-500">
                {s.totalReturned} pcs
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-medium text-slate-500">
                {s.totalDamaged} pcs
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-bold text-slate-700 text-sm">
                ৳{s.totalSales.toFixed(2)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-bold text-emerald-600 text-sm">
                ৳{s.totalProfit.toFixed(2)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right font-bold text-rose-500 text-sm">
                ৳{s.totalLoss.toFixed(2)}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border border-emerald-200/50 shadow-xs flex items-center justify-center gap-1 w-fit mx-auto">
                  <CheckCircle size={10} />
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/print-settlement/${s.id}`)}
                    title="Print Settlement Invoice"
                  >
                    <Printer size={15} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <Empty text="No settlements yet. Create a loading sheet and settle it." />
  );
}

function Empty({ text }: { text: string }) {
  return (
    <Card className="border border-dashed shadow-none">
      <CardContent className="flex h-40 flex-col items-center justify-center text-muted-foreground gap-2">
        <FileText size={40} className="text-slate-300" />
        <p className="text-sm font-medium">{text}</p>
      </CardContent>
    </Card>
  );
}
