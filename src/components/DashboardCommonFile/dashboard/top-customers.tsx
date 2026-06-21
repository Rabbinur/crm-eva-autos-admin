"use client"

import { Card, CardContent } from "@/components/ui/card"

interface TopCustomer {
  _id: string
  name: string
  totalOrders: number
  totalSpent: number
}

interface TopCustomersProps {
  customers?: TopCustomer[]
}

export function TopCustomers({ customers = [] }: TopCustomersProps) {
  return (
    <Card className="rounded-none bg-white shadow-2xl">
      <CardContent className="p-4">
        <h3 className="text-lg font-bold  mb-4">
          Top Customers
        </h3>

        {customers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No customer data available
          </p>
        ) : (
          <div className="space-y-3">
            {customers.map((customer, index) => (
              <div
                key={customer._id}
                className="flex items-center justify-between border-b last:border-b-0 pb-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {index + 1}. {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Orders: {customer.totalOrders}
                  </p>
                </div>

                <div className="text-sm font-semibold text-green-600">
                  ${customer.totalSpent.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}