'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrintLayoutProps {
    title: string;
    invoiceNo: string;
    invoiceLabel?: string;
    onBack: () => void;
    children: React.ReactNode;
}

export default function PrintLayout({
    title,
    invoiceNo,
    invoiceLabel = 'Invoice No',
    onBack,
    children
}: PrintLayoutProps) {
    
    // Automatically trigger print dialog once loaded
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 print:p-0">
            {/* Header controls - hidden on print */}
            <div className="mb-6 flex justify-between items-center print:hidden">
                <Button variant="outline" size="sm" onClick={onBack} className="bg-transparent gap-2 border-slate-300">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => window.print()} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Printer className="h-4 w-4" /> Print Sheet
                </Button>
            </div>

            {/* Printable Document Container */}
            <div className="max-w-4xl mx-auto bg-white p-0">
                
                {/* Distributor Header */}
                <div className="border-b pb-6 flex flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Kanrul's Distributor</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Warehouse & Delivery Management System</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-slate-700">{title}</h2>
                        <p className="text-sm text-slate-500 font-mono mt-1">
                            {invoiceLabel}: <span className="font-semibold text-slate-700">{invoiceNo}</span>
                        </p>
                    </div>
                </div>

                {/* Content Grid & Body */}
                {children}

                {/* Print Footnote */}
                <div className="mt-8 flex justify-between items-center text-[10px] text-muted-foreground font-mono border-t pt-4 border-slate-100">
                    <p>* This is an electronically generated document.</p>
                    <p>Printed on: {new Date().toLocaleString('en-US', { hour12: true })}</p>
                </div>
            </div>
        </div>
    );
}
