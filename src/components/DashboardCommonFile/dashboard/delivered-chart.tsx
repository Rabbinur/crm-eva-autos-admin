
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Download, FileSpreadsheet } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import * as XLSX from "xlsx"
import RevenueDescriptionTooltip from "./RevenueDescriptionTooltip"

// ApexCharts must be dynamically imported (SSR safe)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
})

type RangeOption = "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly" | "All"

interface ChartData {
    name: string
    value: number
}

interface DeliveredChartProps {
    title?: string
    deliveredCount?: number
    data?: ChartData[]
    details?: string
}

export function DeliveredChart({
    title = "Today's Delivered",
    deliveredCount = 0,
    data = [],
    details = ""
}: DeliveredChartProps) {
    const [selectedRange, setSelectedRange] = useState<RangeOption>("All")

    // ------------------- Safe data mapping -----------------
    const safeData = data.map(item => ({
        name: item.name || "",
        value: Number(item.value) || 0
    }))

    // ------------------- Filtered series based on range -----------------
    const getFilteredSeries = () => {
        const totalPoints = safeData.length
        let count = totalPoints

        switch (selectedRange) {
            case "Monthly":
                count = Math.min(1, totalPoints)
                break
            case "Quarterly":
                count = Math.min(3, totalPoints)
                break
            case "Half-Yearly":
                count = Math.min(6, totalPoints)
                break
            case "Yearly":
            case "All":
            default:
                count = totalPoints
        }

        const filtered = safeData.slice(totalPoints - count)
        return filtered
    }

    const filteredData = getFilteredSeries()

    const series = [
        {
            name: "Orders",
            data: filteredData.map(d => d.value),
        },
    ]

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            height: 250,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        xaxis: {
            categories: filteredData.map(d => d.name),
            labels: { rotate: -45 },
        },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.8, opacityTo: 0.1 },
        },
        dataLabels: { enabled: false },
        tooltip: { theme: "light", y: { formatter: val => `${val}` } },
        grid: { strokeDashArray: 4 },
    }

    const lastCols = filteredData.length

    // ------------------- PDF Download -----------------
    const handleDownloadPDF = async () => {
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
        const pageW = doc.internal.pageSize.getWidth()
        const pageH = doc.internal.pageSize.getHeight()
        const margin = { left: 12, right: 12, top: 16 }
        let currentY = margin.top

        // Logo
        const logoUrl = "/logo.png"
        const imgProps = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image()
            img.src = logoUrl
            img.onload = () => resolve(img)
        })
        const logoWidth = 40
        const logoHeight = (imgProps.height / imgProps.width) * logoWidth
        doc.addImage(logoUrl, "PNG", margin.left, currentY, logoWidth, logoHeight)

        // Header
        const centerX = pageW / 2
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("DgPrint24", centerX, currentY + logoHeight / 2 + 2, { align: "center" })
        currentY += logoHeight + 6
        doc.setFontSize(14)
        doc.text(title, centerX, currentY, { align: "center" })
        currentY += 6

        doc.setFontSize(10)
        doc.text(`Generated at ${format(new Date(), "MM/dd/yyyy hh:mm a")}`, margin.left, currentY)
        currentY += 6

        // if (details) {
        //     const wrappedDesc = doc.splitTextToSize(details, pageW - margin.left - margin.right)
        //     const boxHeight = wrappedDesc.length * 6 + 4
        //     doc.setDrawColor(10, 51, 67)
        //     doc.setFillColor(240, 240, 240)
        //     doc.rect(margin.left, currentY, pageW - margin.left - margin.right, boxHeight, "FD")
        //     doc.text(wrappedDesc, margin.left + 2, currentY + 6)
        //     currentY += boxHeight + 4
        // }
        // --- Add selected months/year as header row above table ---
        currentY += 6
        const selectedMonths = filteredData.map(d => d.name).join(", ")
        doc.setFont("helvetica", "bold")
        doc.text(`Months: ${selectedMonths}`, margin.left, currentY)
        currentY += 6
        const tableBody = filteredData.map(d => [d.name, d.value])
        const headerRow = ["Month", "Orders"]

        autoTable(doc, {
            startY: currentY + 2,
            head: [headerRow],
            body: tableBody,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [10, 51, 67], textColor: 255 },
            theme: "grid",
            didDrawPage: () => {
                doc.setFontSize(10)
                doc.setTextColor(100)
                doc.text("Developed by ZSI.ai", pageW / 2, pageH - 10, { align: "center" })
            }
        })

        doc.save(`DG-Print24-order_report_${selectedRange}_${new Date().toLocaleDateString()}.pdf`)
    }

    // ------------------- Excel Download -----------------
    const handleDownloadExcel = () => {
        const aoa: any[][] = []
        aoa.push(["DGPRINT24"])
        aoa.push([title])
        aoa.push([`Generated at ${format(new Date(), "MM/dd/yyyy hh:mm a")}`])
        aoa.push([])
        aoa.push(["Description"])
        aoa.push([details || "—"])
        aoa.push([])
        aoa.push(["Name", "Orders"])

        filteredData.forEach(d => aoa.push([d.name, d.value]))

        const ws = XLSX.utils.aoa_to_sheet(aoa)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Delivered Report")
        XLSX.writeFile(wb, `DG-Print24-orders_trend_Report_${selectedRange}_${new Date().toLocaleDateString()}.xlsx`)
    }

    return (
        <Card className="rounded-none shadow-2xl bg-white">
            <CardContent className="p-4">
                <div className="flex flex-col xl:flex-row gap-2 items-center justify-between mb-3">
                    <h3 className="text-lg font-bold flex gap-1">
                        {title}:{details && <RevenueDescriptionTooltip description={details} />}
                        <span className="text-red-600 font-bold">{deliveredCount.toLocaleString()}</span>
                    </h3>
                    <div> <select
                        value={selectedRange}
                        onChange={e => setSelectedRange(e.target.value as RangeOption)}
                        className="border px-2 py-1 rounded"
                    >
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Half-Yearly</option>
                        <option>Yearly</option>
                        <option>All</option>
                    </select></div>
                    <div className="flex gap-2 items-center">


                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleDownloadPDF}
                        >
                            <Download size={16} /> Generate PDF
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={handleDownloadExcel}
                        >
                            <FileSpreadsheet size={16} />Download Excel
                        </button>
                    </div>
                </div>

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
