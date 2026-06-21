'use client';

import { LoadingSheet } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Printer, MapPin, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  loadingSheets: LoadingSheet[];
};

export default function LoadingSheetsTab({ loadingSheets }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Stock Transfers</span>
          <h2 className="text-lg font-bold text-[#001f3f] mt-0.5">Warehouse Shipments</h2>
        </div>
        <Button onClick={() => router.push('/dashboard/delivery/loading-sheets/create')} className="gap-2 rounded-xl">
          <Plus size={16} />
          Create Loading Sheet
        </Button>
      </div>

      {loadingSheets.length ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Invoice No</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Date & Route</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400">Delivery Representative</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Items</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Stock Cost</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Expected Sales</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-center">Status</TableHead>
                <TableHead className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50">
              {loadingSheets.map(sheet => {
                const totalCostValue = sheet.totalCost ?? sheet.items.reduce(
                  (s, i) => s + i.quantity * i.purchasePrice,
                  0
                );
                const totalSalesValue = sheet.totalExpectedSales ?? sheet.items.reduce(
                  (s, i) => s + i.quantity * i.sellingPrice,
                  0
                );

                return (
                  <TableRow key={sheet.id} className="hover:bg-blue-50/10 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary/70 shrink-0" />
                        <span className="font-mono font-bold text-foreground text-sm tracking-tight">{sheet.invoiceNo || sheet.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={12} />
                          {sheet.date}
                        </span>
                        {sheet.route && (
                          <span className="text-xs text-foreground/80 font-semibold flex items-center gap-1">
                            <MapPin size={12} className="text-primary" />
                            {sheet.route}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-[#001f3f]">
                      {sheet.deliveryManName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Badge variant="outline" className="rounded-md bg-slate-50 text-slate-600 font-semibold text-xs py-0.5 px-2">
                        {sheet.items.length} items
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-bold text-slate-700 text-sm">
                      ৳{totalCostValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-bold text-primary text-sm">
                      ৳{totalSalesValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant={sheet.status === 'settled' ? 'secondary' : 'default'} className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize tracking-wide shadow-xs">
                        {sheet.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {sheet.status !== 'settled' && (
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/95 text-white font-bold rounded-lg px-3 py-1.5 h-8 shadow-sm transition-all"
                            onClick={() => router.push(`/dashboard/delivery/settlements/create?sheetId=${sheet.id}`)}
                          >
                            Settle
                          </Button>
                        )}
                        
                        {/* View Details Eye button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => router.push(`/dashboard/delivery/loading-sheets/${sheet.id}`)}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => router.push(`/print-loading-sheet/${sheet.id}`)}
                          title="Print Challan"
                        >
                          <Printer size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Empty text="No loading sheets yet. Create one to load products." />
      )}
    </div>
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
