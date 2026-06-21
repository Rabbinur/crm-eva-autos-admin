
// "use client";

// import type ApexCharts from "apexcharts";
// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//     ssr: false,
// });
// type DonutChartProps = {
//   data: { name: string; total_orders: number }[];
//   title?: string;
//   colors?: string[];
//   isLoading: boolean;
// };
// type OrderType = {
//     name: string;
//     total_orders: number;
// };

// const OrderTypeChart = ({ data, isLoading }: DonutChartProps) => {

//     const [series, setSeries] = useState<number[]>([]);
//     const [labels, setLabels] = useState<string[]>([]);
//  console.log("status",data)
//     useEffect(() => {
//         if (!data?.data?.types) return;

//         const types: OrderType[] = data.data.types;

//         const custom = types.find((t) => t.name === "Custom");
//         const online = types.find((t) => t.name === "Online");

//         const chartTypes: OrderType[] = [
//             { name: "Custom", total_orders: custom?.total_orders || 0 },
//             { name: "Online", total_orders: online?.total_orders || 0 },
//         ];

//         setSeries(chartTypes.map((t) => t.total_orders));
//         setLabels(chartTypes.map((t) => t.name)); // ✅ Only strings
//     }, [data]);

//     const options: ApexCharts.ApexOptions = {
//         chart: {
//             type: "donut",
//             height: 300,
//             fontFamily: "Inter, sans-serif",
//         },
//         labels, // ✅ Use 'labels' not 'label'
//         colors: ["#F59E0B", "#10B981"],
//         stroke: {
//             width: 2,
//             colors: ["#ffffff"],
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         tooltip: {
//             theme: "light",
//         },
//         legend: {
//             show: true,
//             position: "bottom",
//             fontSize: "12px",
//             horizontalAlign: "center",

//         },
//         plotOptions: {
//             pie: {
//                 donut: {
//                     size: "65%",
//                 },
//             },
//         },
//     };

//     if (isLoading) {
//         return (
//             <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-sm">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 bg-white rounded-none shadow-md w-full max-w-sm overflow-hidden">
//             <h2 className="text-lg font-semibold mb-4">Order Type Distribution</h2>
//             <div className="h-[300px] flex flex-col items-center justify-center">
//                 <ReactApexChart
//                     options={options}
//                     series={series}
//                     type="donut"
//                 //   width={200}
//                 //   height={300}
//                 />
//             </div>
//         </div>
//     );
// };

// export default OrderTypeChart;


"use client";

import type ApexCharts from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

type OrderType = {
    name: string;
    total_orders: number;
};

type DonutChartProps = {
    data: { types: OrderType[] };
    title?: string;
    colors?: string[];
    isLoading: boolean;
};

const OrderTypeChart = ({ data, isLoading, title = "Order Type Distribution" }: DonutChartProps) => {
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        if (!data?.types) return;

        // Use all types dynamically
        setSeries(data.types.map((t) => t.total_orders));
        setLabels(data.types.map((t) => t.name));
    }, [data]);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut",
            height: 300,
            fontFamily: "Inter, sans-serif",
        },
        labels,
        colors: ["#F59E0B", "#147c59"], // Customizable
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
            show: true,
            position: "bottom",
            fontSize: "12px",
            horizontalAlign: "center",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-sm">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-none shadow-md w-full max-w-sm overflow-hidden">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="h-[300px] flex flex-col items-center justify-center">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="donut"
                />
            </div>
        </div>
    );
};

export default OrderTypeChart;
