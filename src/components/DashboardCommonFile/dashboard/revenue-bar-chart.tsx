// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import type ApexCharts from "apexcharts"
// import dynamic from "next/dynamic"

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//     ssr: false,
// })

// interface RevenueData {
//     month: string
//     revenue: number
// }

// interface RevenueBarChartProps {
//     title?: string
//     totalRevenue?: number
//     data?: RevenueData[]
// }

// export function RevenueBarChart({ title = "Revenue", totalRevenue = 0, data = [] }: RevenueBarChartProps) {
//     const safeData = data.map((item) => ({
//         month: item?.month || "",
//         revenue: Number(item?.revenue) || 0,
//     }))

//     const series = [
//         {
//             name: "Revenue",
//             data: safeData.map((d) => d.revenue),
//         },
//     ]

//     const options: ApexCharts.ApexOptions = {
//         chart: {
//             type: "bar",
//             height: 300,
//             toolbar: { show: false },
//         },
//         xaxis: {
//             categories: safeData.map((d) => d.month),
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         colors: ["#163556"],
//         tooltip: {
//             theme: "light",
//             y: {
//                 formatter: (val) => `$${val.toFixed(2)}`,
//             },
//         },
//     }

//     return (
//         <Card className="border border-border bg-white shadow-xs">
//             <CardContent className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                     {title}: <span className="text-green-600">${Number(totalRevenue).toLocaleString()}</span>
//                 </h3>

//                 <div className="h-[300px]">
//                     <ReactApexChart options={options} series={series} type="bar" height={300} />
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


"use client"

import { Card, CardContent } from "@/components/ui/card"
import type ApexCharts from "apexcharts"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
})

interface RevenueData {
    month: string
    revenue: number
}

interface RevenueBarChartProps {
    title?: string
    totalRevenue?: number
    data?: RevenueData[]
}

/**
 * Bar-wise alternating colors
 * 1st bar  -> #163556
 * 2nd bar  -> #fe9f15
 * 3rd bar  -> #163556
 * 4th bar  -> #fe9f15
 */
const BAR_COLORS = ["#163556", "#fe9f15"]

const getBarColors = (length: number) => {
    return Array.from({ length }, (_, index) => BAR_COLORS[index % 2])
}

export function RevenueBarChart({
    title = "Revenue",
    totalRevenue = 0,
    data = [],
}: RevenueBarChartProps) {
    // sanitize data
    const safeData = data.map((item) => ({
        month: item?.month || "",
        revenue: Number(item?.revenue) || 0,
    }))

    const series = [
        {
            name: "Revenue",
            data: safeData.map((d) => d.revenue),
        },
    ]

    const barColors = getBarColors(safeData.length)

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            height: 300,
            toolbar: { show: false },
            fontFamily: "Inter, sans-serif",
        },
        plotOptions: {
            bar: {
                columnWidth: "55%",
                borderRadius: 6,
            },
        },
        xaxis: {
            categories: safeData.map((d) => d.month),
            labels: {
                style: {
                    fontSize: "12px",
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: barColors, // ✅ alternating per bar
        tooltip: {
            theme: "light",
            y: {
                formatter: (val) => `$${val.toFixed(2)}`,
            },
        },
    }

    return (
        <Card className="border border-border bg-white shadow-sm rounded-xl">
            <CardContent className="p-4">
                <h3 className="text-lg  font-bold mb-3">
                    {title}:{" "}
                    <span className="text-green-600  font-bold">
                        ${Number(totalRevenue).toLocaleString()}
                    </span>
                </h3>

                <div className="h-[300px]">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={300}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
