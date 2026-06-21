export type Batch = {
    id: string;
    batch_id?: string;

    packs_added: number;            // কতটা pack/carton add করা হয়েছে
    pack_price: number;             // batch-wise fixed pack price
    packs_total_price?: number;     // batch-wise total price of packs
    purchase_rate_carton: number;   // purchase rate per carton
    selling_rate_carton: number;    // selling rate per carton
    dateAdded: string;
    purchase_cost?: number;
    profit?: number;
};

export type Product = {
    id: string;
    name: string;
    weight: number;
    unit: string;
    product_summary?: string;        // e.g., 'Mini Box', 'Tin Box', 'Retail Pack'
    carton_packets: number;         // carton size reference (informative)
    box_size?: number;              // number of packets/pieces per box (optional)
    company_name: string;
    category_name: string;
    lowStockThreshold: number;

    total_stock?: number;           // illustrative/demo only
    total_stock_value?: number;     // illustrative/demo only
    cartons?: number;
    boxes?: number;
    pieces?: number;
    has_box_size?: boolean;
    equivalent_stock?: string;

    batches: Batch[];

    minPurchase?: number;
    maxPurchase?: number;
    minSelling?: number;
    maxSelling?: number;
    weightedAvgPurchase?: number;
    weightedAvgSelling?: number;
    estTotalPurchaseCost?: number;
    estProfit?: number;
    profitMarginPercent?: number;

    createdAt: string;
    updatedAt: string;
};




// Helper to format currency
export const formatCurrency = (val: number) => `৳${val.toFixed(2)}`;