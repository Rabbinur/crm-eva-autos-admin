"use client"

import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import RevenueDescriptionTooltip from "./RevenueDescriptionTooltip"

// ApexCharts (SSR safe)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
})

interface ChartData {
    name: string
    value: number
}

interface SalesChartProps {
    title?: string
    totalSales?: number
    data?: ChartData[]
    details: string
}

export function SalesChart({
    title = "Monthly Sales",
    totalSales = 0,
    data = [], details
}: SalesChartProps) {



    // 🔥 DEBUG LOG 2: mapped data
    const safeData = data.map(item => ({
        name: item?.name || "",
        value: Number(item?.value) || 0,
    }))

   

    const series = [
        {
            name: "Sales",
            data: safeData.map(d => d.value),
        },
    ]

 

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            height: 250,
            toolbar: { show: false },
        },
        xaxis: {
            categories: safeData.map(d => d.name),
        },
        stroke: {
            curve: "smooth",
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.8,
                opacityTo: 0.1,
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: "light",
        },
    }

   

    return (
        <Card className="rounded-none shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-4">
                <h3 className="text-lg font-bold flex gap-1 mb-3">
                    {title}: {details && <RevenueDescriptionTooltip description={details} />}
                    <span className="text-green-600  font-bold">
                        ${Number(totalSales).toLocaleString()}
                    </span>
                </h3>

                <div className="h-[250px]">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="area"
                        height={250}
                    />
                </div>
            </CardContent>
        </Card>
    )
}