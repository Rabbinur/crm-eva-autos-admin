"use client";

import { DetailModal } from "@/app/(withDashboardLayout)/dashboard/(user-management)/admin-management/_component/DetailModal";
import { useDebouncedValue } from "@/app/hooks/useDebouncedValue";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number; // 👈 total records from API
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void; // 👈 callback to fetch next/prev page
    searchPlaceholder?: string;
    searchKey?: string;
    onDeleteSelected?: (rows: TData[]) => void;
    showDeleteButton?: boolean;
    columnDropdownTitle?: string;
    isLoading?: boolean;
    isError?: boolean;
    onSearchChange?: (value: string) => void; // server-side callback
    controlPosition?: "input-first" | "columns-first" | "input-end" | "columns-end";
}

export function DataTable<TData, TValue>({
    columns,
    data,
    totalItems,
    currentPage,
    pageSize,
    isLoading = false,
    isError = false,
    onPageChange,
    searchPlaceholder = "Search...",
    searchKey = "name",
    onDeleteSelected,
    onSearchChange,
    showDeleteButton = true,
    columnDropdownTitle = "Columns",
    controlPosition = "input-first",
}: DataTableProps<TData, TValue>) {
    const [selectedRow, setSelectedRow] = React.useState<TData | null>(null);
    const [detailModalOpen, setDetailModalOpen] = React.useState(false);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [openDialog, setOpenDialog] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const debouncedTerm = useDebouncedValue(filterValue, 500);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getSortedRowModel: getSortedRowModel(), // ✅ Enable sorting
        onSortingChange: setSorting, // ✅ Hook into state
        // getFilteredRowModel: getFilteredRowModel(), // ✅ for local filtering
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility,
            rowSelection,
            sorting, // ✅ Include it in state
            // globalFilter: filterValue,
        },
        // onGlobalFilterChange: setFilterValue,
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows.map(
        (row) => row.original
    );
    // handle input change
    // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setFilterValue(value);
    //     if (onSearchChange) onSearchChange(debouncedTerm); // call server search
    // }
    // handle input change
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    // ✅ Trigger server search after debounce delay
    React.useEffect(() => {
        if (onSearchChange) onSearchChange(debouncedTerm.trim());
    }, [debouncedTerm, onSearchChange]);
    const handleDelete = () => {
        if (onDeleteSelected) onDeleteSelected(selectedRows);
        setOpenDialog(false);
        table.resetRowSelection();
    };

    // ✅ Controls UI Order based on `controlPosition`
    const renderControls = () => {
        const input = (
            <Input
                placeholder={searchPlaceholder}
                value={filterValue}
                onChange={handleFilterChange}
                className="max-w-sm border border-gray-300"
            />
        );

        const dropdown = (
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" onClick={(e) => e.stopPropagation()} className="bg-transparent">
                        {columnDropdownTitle} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );

        const deleteBtn =
            showDeleteButton && selectedRows.length > 0 ? (
                <Button variant="destructive" onClick={(e) => {
                    e.stopPropagation(); // ✅ Prevent row click
                    setOpenDialog(true);
                }}>
                    Delete Selected ({selectedRows.length})
                </Button>
            ) : null;

        const groups: Record<string, React.ReactNode[]> = {
            "input-first": [input, deleteBtn, dropdown],
            "columns-first": [dropdown, deleteBtn, input],
            "input-end": [deleteBtn, dropdown, input],
            "columns-end": [input, deleteBtn, dropdown],
        };

        return (
            <div className="flex items-center justify-between gap-4">
                {groups[controlPosition].map(
                    (el, i) => el && <React.Fragment key={i}>{el}</React.Fragment>
                )}
            </div>
        );
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="space-y-4">
            {/* Top Controls */}
            {renderControls()}

            {/* Table */}
            <div className="rounded-none border">
                <Table>

                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        className={cn(
                                            "cursor-pointer select-none",
                                            header.column.getCanSort() ? "hover:text-blue-600" : ""
                                        )}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: "↑",
                                                desc: "↓",
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>


                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001f3f]"></div>
                                        <span className="text-[#001f3f] font-semibold text-sm animate-pulse">Loading data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                    Failed to load data
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => {
                                        const isActionCell = cell.column.id === "actions" || cell.column.id === "select";

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                onClick={() => {
                                                    if (!isActionCell) {
                                                        setSelectedRow(row.original);
                                                        setDetailModalOpen(true);
                                                    }
                                                }}
                                                className={!isActionCell ? "cursor-pointer hover:bg-gray-50" : ""}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} | {totalItems} total items
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{selectedRows.length}</strong> selected{" "}
                            {selectedRows.length === 1 ? "item" : "items"}? This action cannot
                            be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Row Detail Modal */}
            {/* <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
                <DialogContent className="max-w-2xl ">
                    <DialogHeader>
                        <DialogTitle>Details</DialogTitle>
                        <DialogDescription>Full record information</DialogDescription>
                    </DialogHeader>

                    {selectedRow ? (
                        <div className="mt-4 space-y-3 grid grid-cols-2 gap-x-10">
                            {Object.entries(selectedRow).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex justify-between border-b pb-1 text-sm"
                                >
                                    <span className="font-medium capitalize text-gray-700">
                                        {key.replace(/_/g, " ")}:
                                    </span>
                                    <span className="text-gray-900">
                                        {String(value ?? "N/A")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No data available.</p>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}

            <DetailModal
                detailModalOpen={detailModalOpen}
                setDetailModalOpen={setDetailModalOpen}
                selectedRow={selectedRow as Record<string, any> | null}
            />
        </div>
    );
}
