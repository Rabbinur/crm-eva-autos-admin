'use client';

import { useGetLoadingSheetsQuery } from '@/components/Redux/RTK/distributorApiNode';
import LoadingSheetsTab from '../_components/LoadingSheetsTab';
import { Loader2 } from 'lucide-react';

import { useMemo } from 'react';

export default function LoadingSheetsPage() {
  const { data: loadingSheets = [], isLoading } = useGetLoadingSheetsQuery();

  const activeLoadingSheets = useMemo(() => {
    return loadingSheets.filter((sheet: any) => sheet.status !== 'settled');
  }, [loadingSheets]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] p-6">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-3" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading sheets...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loading Sheets</h1>
          <p className="mt-2 text-muted-foreground">
            Manage warehouse to representative stock transfers
          </p>
        </div>
      </div>

      <LoadingSheetsTab loadingSheets={activeLoadingSheets} />
    </div>
  );
}
