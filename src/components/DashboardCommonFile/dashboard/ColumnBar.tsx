//@ts-nocheck
"use client";

import dynamic from "next/dynamic";
import RevenueDescriptionTooltip from "./RevenueDescriptionTooltip";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const options = {
    chart: {
        type: "bar",
        height: 350,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 6,
        },
    },
    legend: {
        position: "right",
        verticalAlign: "center",
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
    },
    yaxis: {
        title: {
            text: "Revenue",
            offsetX: -10,
            offsetY: -10,
        },
    },
    tooltip: {
        y: {
            formatter: (val: number) => `$${val}`,
        },
    },
};

const ColumnChart = ({
    title,
    data,
}: {
    title: string;
    data: {
        revenue: { year: string; months: number[] }[];
        description: string
    };
}) => {

    // ✅ same mapping as AreaChart
    const series = data?.revenue?.map(item => ({
        name: item.year,
        data: item.months,
    })) ?? [];

    // ✅ total revenue
    const totalRevenue = data?.revenue
        ?.flatMap(r => r.months)
        ?.reduce((a, b) => a + b, 0) ?? 0;

    return (
        <div className="p-10 bg-white shadow-2xl">

            <h3 className="text-lg font-bold mb-3 flex gap-2">
                {title}:{" "}
                {data?.description && (
                    <RevenueDescriptionTooltip description={data.description} />
                )}
            </h3>

            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default ColumnChart;
