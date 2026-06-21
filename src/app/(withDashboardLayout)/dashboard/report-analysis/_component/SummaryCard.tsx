import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SummaryCard({ summary }:any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p>Total Revenue</p>
          <strong>${summary?.totalRevenue}</strong>
        </div>
        <div>
          <p>Total Orders</p>
          <strong>{summary?.totalOrders}</strong>
        </div>
        <div>
          <p>Net Sales</p>
          <strong>${summary?.totalRevenue}</strong>
        </div>
      </CardContent>
    </Card>
  )
}
