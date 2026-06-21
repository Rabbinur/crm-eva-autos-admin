import { useEffect, useRef } from "react"
import { DateRangePicker } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

export function formatDate(dateString: string | Date) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).replace(/ /g, "-")
}
// ------------------ DateRangePicker Component ------------------
interface DateRangePickerProps {
    range: any[]
    setRange: (range: any[]) => void
    onClose: () => void
}
// ------------------ Custom Hook for Click Outside ------------------
function useOutsideAlerter(ref: any, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [ref, callback])
}
const CustomDateRangePicker: React.FC<DateRangePickerProps> = ({ range, setRange, onClose }) => {
    const pickerRef = useRef<any>(null)
    useOutsideAlerter(pickerRef, onClose)

    return (
        <div ref={pickerRef} className="absolute right-0 mt-2 z-50">
            <DateRangePicker
                editableDateInputs={true}
                onChange={(item: any) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                className="bg-white border rounded-none shadow-lg"
            />
            <div className="flex justify-end mt-2">
                <button
                    className="text-sm text-blue-600 px-3 py-1 hover:underline"
                    onClick={onClose}
                >
                    Done
                </button>
            </div>
        </div>
    )
}

export default CustomDateRangePicker