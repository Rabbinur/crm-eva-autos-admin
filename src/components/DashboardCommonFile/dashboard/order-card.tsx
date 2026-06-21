import { Button } from "@/components/ui/button"
import { MoreVertical, ShoppingBag, TrendingDown, TrendingUp } from "lucide-react"

interface OrderCardProps {
  title: string
  count: number
  percentage: number
  isPositive: boolean
  icon: string
}

export function OrderCard({ title, count, percentage, isPositive, icon }: OrderCardProps) {
  return (
    <div className="bg-white rounded-none border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical size={16} />
        </Button>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-none flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{count.toLocaleString()}</div>
              <div className="flex items-center hidden gap-1">
                {isPositive ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
                <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground hidden mt-4">Compared to yesterday</p>
    </div>
  )
}
