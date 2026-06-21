export type DeliveryManStatus = 'active' | 'inactive';

export interface DeliveryMan {
    id: string;
    name: string;
    phone: string;
    status: 'active' | 'inactive';
    nid: string;
    address: string;
    profile?: string;
}

export interface LoadingSheetItem {
    productId: string;
    productName: string;
    quantity: number; // pieces
    purchasePrice: number; // per piece
    sellingPrice: number; // per piece
}

export interface LoadingSheet {
    id: string;
    invoiceNo?: string;
    date: string;
    deliveryManName: string;
    deliveryManId: string;
    route?: string; // Route or area for loading sheet
    items: LoadingSheetItem[];
    status: 'loaded' | 'settled';
    totalCost?: number;
    totalExpectedSales?: number;
}

export interface SettlementItem {
    productId: string;
    productName: string;
    loadedQuantity: number;
    soldQuantity: number;
    returnedQuantity: number;
    damagedQuantity: number;
    purchasePrice: number; // per piece
    sellingPrice: number; // per piece
}

export interface Settlement {
    id: string;
    invoiceNo?: string;
    loadingSheetInvoiceNo?: string;
    date: string;
    deliveryManName: string;
    deliveryManId: string;
    route?: string; // Route or area for settlement
    loadingSheetId: string;
    totalLoaded: number;
    totalSold: number;
    totalReturned: number;
    totalDamaged: number;
    totalSales: number;
    totalProfit: number;
    totalLoss: number;
    status: 'finalized';
    items: SettlementItem[];
}
