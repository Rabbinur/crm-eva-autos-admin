import Link from "next/link";

const products = [
  { id: "1", name: "Premium Copier Paper", packType: "Carton", stockPieces: 120, sellingPricePerPiece: 5.0 },
  { id: "2", name: "Glossy Photo Paper", packType: "Pack", stockPieces: 85, sellingPricePerPiece: 8.0 }
];

export default function InventoryTable() {
    return (
        <div className="bg-muted/50 shadow-lg">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="p-3 text-left">Product</th>
                        <th>Pack</th>
                        <th>Stock (pcs)</th>
                        <th>Sell / pcs</th>
                        <th className="text-right p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t border-zinc-800">
                            <td className="p-3">{p.name}</td>
                            <td>{p.packType}</td>
                            <td>{p.stockPieces}</td>
                            <td>৳{p.sellingPricePerPiece}</td>
                            <td className="text-right p-3 space-x-2">
                                <Link href={`/dashboard/inventory-management/${p.id}`}>👁</Link>
                                <Link href={`/dashboard/inventory-management/${p.id}/edit`}>✏️</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
