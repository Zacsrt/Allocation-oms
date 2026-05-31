"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Customer } from "@/mock/customer";
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

type CustomersTableProps = {
  customers: Customer[];
  isActive?: boolean;
  customerSpentMap?: Record<string, number>;
};

type SortByKey = "customerId" | "customerName" | "creditLimit" | "usedCredit" | "availableCredit";
type SortOrder = "asc" | "desc";

const sortByOptions: { key: SortByKey; label: string }[] = [
  { key: "customerId", label: "Customer ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "creditLimit", label: "Credit Limit" },
  { key: "usedCredit", label: "Used Credit" },
  { key: "availableCredit", label: "Available Credit" },
];

export function CustomersTable({
  customers,
  isActive = true,
  customerSpentMap = {},
}: CustomersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortByKey>("customerId");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const rows = useMemo(() => {
    return customers.map((customer) => {
      const spent = customerSpentMap[customer.customerId] ?? 0;
      const usedCredit = customer.usedCredit + spent;

      return {
        ...customer,
        usedCredit,
        availableCredit: customer.creditLimit - usedCredit,
      };
    });
  }, [customers, customerSpentMap]);

  const filteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((customer) => {
      return (
        customer.customerId.toLowerCase().includes(keyword) ||
        customer.customerName.toLowerCase().includes(keyword)
      );
    });
  }, [rows, searchText]);

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
    if (!isActive) return;
    if (searchParams.get("page")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, [isActive, pathname, router, searchParams]);

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
            placeholder="Search Customer ID / Name"
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
            <TableHead>Customer ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead className="text-right">Credit Limit</TableHead>
            <TableHead className="text-right">Used Credit</TableHead>
            <TableHead className="text-right">Available Credit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.map((customer) => (
            <TableRow key={customer.customerId}>
              <TableCell>{customer.customerId}</TableCell>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell className="text-right">{customer.creditLimit.toLocaleString()}</TableCell>
              <TableCell className="text-right">{customer.usedCredit.toLocaleString()}</TableCell>
              <TableCell className="text-right">{customer.availableCredit.toLocaleString()}</TableCell>
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
