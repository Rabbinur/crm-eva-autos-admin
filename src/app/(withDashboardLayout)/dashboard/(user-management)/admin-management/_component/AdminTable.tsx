// src/components/AdminTable.tsx
"use client";
import { Admin } from "@/@types/admin";
import { DataTable } from "@/components/Common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";



interface AdminTableProps {
  data: Admin[];
  totalItems: number;
  currentPage: number;
  per_page: number;
  onPageChange: (page: number) => void;
  onEdit: (user: Admin) => void;
  onDelete: (user: Admin) => void;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onView?: (user: Admin) => void;
}

export default function AdminTable({
  data,
  totalItems,
  currentPage,
  onPageChange, onSearchChange,
  onEdit,
  onDelete,
  per_page,
  isLoading,
  isError,
}: AdminTableProps) {
  const columns: ColumnDef<Admin>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //     />
    //   ),
    // },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="bg-green-400 text-white" variant={row.getValue("status") === "active" ? "default" : "outline"}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    { accessorKey: "work_place", header: "Workplace" },
    // {
    //   accessorKey: "created_at",
    //   header: "Created At",
    //   cell: ({ row }) =>
    //     new Date(row.getValue("created_at")).toLocaleDateString(),
    // },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={per_page}
      onPageChange={onPageChange}
      onSearchChange={onSearchChange}
      searchKey="name"
      searchPlaceholder="Search by name..."
      isLoading={isLoading}
      isError={isError}
    />
  );
}
