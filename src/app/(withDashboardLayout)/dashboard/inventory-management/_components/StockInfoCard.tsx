export default function StockInfoCard({ product }: any) {
  return (
    <div className="bg-muted/50 rounded-xl p-5 shadow-lg space-y-2">
      <p>Weight: {product.weight}</p>
      <p>Pack Type: {product.packType}</p>
      <p>1 Carton = {product.piecesPerCarton} pcs</p>
      <p>Total Stock: {product.stockPieces} pcs</p>
      <p>Selling Price: ৳{product.sellingPricePerPiece} / pcs</p>
    </div>
  );
}
