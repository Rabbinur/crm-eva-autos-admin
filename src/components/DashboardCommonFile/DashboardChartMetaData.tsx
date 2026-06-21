"use client";
import { ApexOptions } from "apexcharts";
import { FileText } from "lucide-react";
import { useTheme } from "next-themes"; // Import useTheme from next-themes
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const timeRanges = [
  { value: "12m", label: "12 Months" },
  { value: "6m", label: "6 Months" },
  { value: "30d", label: "30 Days" },
  { value: "7d", label: "7 Days" },
];

const DashboardChartMetaData = () => {
  const [selectedRange, setSelectedRange] = useState("12m");
  const { theme } = useTheme(); // Get the current theme from next-themes

  // Chart data
  const series = [
    {
      name: "Tax Services",
      data: [30, 55, 41, 67, 22, 43, 21, 49, 35, 50, 60, 40],
    },
  ];

  // Chart options
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 400,
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000", // White in dark mode, black in light mode
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#FFFFFF" : "#000000", // White in dark mode, black in light mode
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: theme === "dark" ? "#FFFFFF" : "#000000", // White in dark mode, black in light mode
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light", // Tooltip theme based on dark mode
    },
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
  };

  return (
    <div className="pt-6">
      <div className="bg-white dark:bg-slate-800 rounded-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 px-4">
          <h2 className="text-slate-800 dark:text-white text-base 2xl:text-lg font-medium">
            Revenue Flow Overview
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-50 dark:bg-slate-800 gap-1 rounded-none p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range.value)}
                  className={`px-2 py-1 text-sm rounded-none transition-colors dark:bg-slate-700 ${selectedRange === range.value
                    ? "bg-white text-blue-600 dark:bg-slate-700 shadow-xs"
                    : "text-gray-600 dark:text-white hover:text-gray-900"
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-1 py-1.5 text-sm text-gray-700 dark:bg-slate-700 dark:text-white border rounded-none hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardChartMetaData;
