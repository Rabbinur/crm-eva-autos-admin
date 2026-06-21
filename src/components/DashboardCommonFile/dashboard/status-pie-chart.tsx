

"use client"

import { Card, CardContent } from "@/components/ui/card"
import type ApexCharts from "apexcharts"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
})

interface StatusItem {
    total_orders: number
    status: string
}

interface StatusPieChartProps {
    title?: string
    data?: {
        statuses: StatusItem[]
    }
}

/**
 * Slice-wise alternating colors
 */
const PIE_COLORS = [ "#008000", "#007bff","#FF0000"]

const getPieColors = (length: number) => {
    return Array.from({ length }, (_, index) => PIE_COLORS[index % 3])
}

export function StatusPieChart({
    title = "Order Status Distribution",
    data = { statuses: [] },
}: StatusPieChartProps) {
    const safeData = data.statuses || []

    const formatLabel = (label: string) => {
        if (label.toUpperCase() === "IN_PROGRESS") return "In Progress"
        return label.replace(/_/g, " ")
    }

    const series = safeData.map((d) => d.total_orders)
    const labels = safeData.map((d) => formatLabel(d.status))

    const colors = getPieColors(safeData.length)

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut",
            height: 300,
            fontFamily: "Inter, sans-serif",
        },
        labels,
        colors,
        stroke: {
            width: 2,
            colors: ["#ffffff"],
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: "light",
        },
        legend: {
            position: "bottom",
            fontSize: "12px",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
    }

    return (
        <Card className="rounded-none shadow-2xl overflow-hidden bg-white">
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {title}
                </h3>

                <div className="h-[300px] flex items-center justify-center">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="donut"
                        width={300}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
