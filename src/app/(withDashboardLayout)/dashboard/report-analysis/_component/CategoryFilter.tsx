"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
  value: string
  onChange: (value: string) => void
}

const CategoryFilter = ({ categories, value, onChange }: Props) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Category
      </label>

      <Select
        value={value || "all"}
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>

          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default CategoryFilter
