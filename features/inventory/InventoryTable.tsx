"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Inventory } from "@/mock/inventory";
import { Pagination } from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InventoryTableProps = {
  inventory: Inventory[];
};

type SortByKey =
  | "itemId"
  | "warehouseId"
  | "supplierId"
  | "availableStock"
  | "pricePerUnit";
type SortOrder = "asc" | "desc";

const sortByOptions: { key: SortByKey; label: string }[] = [
  { key: "itemId", label: "Item ID" },
  { key: "warehouseId", label: "Warehouse ID" },
  { key: "supplierId", label: "Supplier ID" },
  { key: "availableStock", label: "Available Stock" },
  { key: "pricePerUnit", label: "Price / Unit" },
];

export function InventoryTable({ inventory }: InventoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortByKey>("itemId");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return inventory;

    return inventory.filter((item) => {
      return (
        item.itemId.toLowerCase().includes(keyword) ||
        item.warehouseId.toLowerCase().includes(keyword) ||
        item.supplierId.toLowerCase().includes(keyword)
      );
    });
  }, [inventory, searchText]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      return String(aValue).localeCompare(String(bValue));
    });

    if (sortOrder === "desc") sorted.reverse();
    return sorted;
  }, [filteredRows, sortBy, sortOrder]);

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const rawPage = Number(searchParams.get("page") ?? "1");
  const safePage = Number.isNaN(rawPage) ? 1 : rawPage;
  const currentPage = Math.min(Math.max(safePage, 1), totalPages);

  useEffect(() => {
    if (searchParams.get("page")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const resetToFirstPage = () => updatePage(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageRows = sortedRows.slice(startIndex, endIndex);

  return (
    <div className="rounded-md border">
      <div className="flex flex-col gap-3 border-b p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
          <input
            type="text"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              resetToFirstPage();
            }}
            placeholder="Search Item / Warehouse / Supplier"
            className="h-10 w-full rounded-md border px-3 text-sm sm:col-span-2 xl:w-72"
          />

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">Sort By:</span>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (sortByOptions.some((option) => option.key === value)) {
                  setSortBy(value as SortByKey);
                  resetToFirstPage();
                }
              }}
            >
              <SelectTrigger className="h-8 w-full min-w-[220px] border-0 px-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">Order:</span>
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                if (value === "asc" || value === "desc") {
                  setSortOrder(value);
                  resetToFirstPage();
                }
              }}
            >
              <SelectTrigger className="h-8 w-full min-w-[120px] border-0 px-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Warehouse ID</TableHead>
            <TableHead>Supplier ID</TableHead>
            <TableHead className="text-right">Available Stock</TableHead>
            <TableHead className="text-right">Price / Unit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.map((item, index) => (
            <TableRow
              key={`${item.itemId}-${item.warehouseId}-${item.supplierId}-${index}`}
            >
              <TableCell>{item.itemId}</TableCell>
              <TableCell>{item.warehouseId}</TableCell>
              <TableCell>{item.supplierId}</TableCell>
              <TableCell className="text-right">{item.availableStock.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.pricePerUnit.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={updatePage}
      />
    </div>
  );
}
