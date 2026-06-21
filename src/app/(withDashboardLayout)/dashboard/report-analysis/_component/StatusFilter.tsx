"use client"
import { Button } from "@/components/ui/button"

type StatusFilterProps = {
  buttons: {
    label: string
    subBtns?: string[]
  }[]
  value: {
    status: string
    sub_status: string
  }
  onChange: (value: { status: string; sub_status: string }) => void
}

export default function StatusFilter({
  buttons,
  value,
  onChange,
}: StatusFilterProps) {
  const { status, sub_status } = value

  const handleParentClick = (label: string) => {
    if (label === "ALL") {
      onChange({ status: "", sub_status: "" })
      return
    }

    onChange({
      status: status === label ? "" : label,
      sub_status: "",
    })
  }

  const handleSubClick = (sub: string) => {
    onChange({
      status,
      sub_status: sub,
    })
  }

  return (
    <div>
      {/* Parent Buttons */}
      <div className="flex flex-wrap gap-2 mb-2">
        {buttons.map((btn) => (
          <Button
            key={btn.label}
            onClick={() => handleParentClick(btn.label)}
            className={`px-3 py-1 text-sm rounded-sm text-white
              ${status === btn.label ? "bg-primary" : "bg-gray-500"}
            `}
          >
            {btn.label.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      {/* Sub Buttons */}
      {status && status !== "ALL" && (
        <div className="flex flex-wrap gap-2">
          {buttons
            .find((b) => b.label === status)
            ?.subBtns?.map((sub) => (
              <Button
                key={sub}
                onClick={() => handleSubClick(sub)}
                className={`px-2 py-1 text-xs rounded-sm text-white
                  ${sub_status === sub ? "bg-primary" : "bg-gray-400"}
                `}
              >
                {sub.replace(/_/g, " ")}
              </Button>
            ))}
        </div>
      )}
    </div>
  )
}
