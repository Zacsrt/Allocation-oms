"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Pencil } from "lucide-react";
import type { Order } from "@/mock/orders";
import type { Customer } from "@/mock/customer";
import type { Inventory } from "@/mock/inventory";
import { Pagination } from "@/components/Pagination";
import {
  AutoAllocationPreviewDialog,
  type AutoPreviewRow,
} from "@/features/dashboard/modal/AutoAllocationPreviewDialog";
import { OrderEditDialog } from "@/features/dashboard/modal/OrderEditDialog";
import { OrderTypeBadge } from "@/components/OrderTypeBadge";
import { ActionResultDialog } from "@/components/ActionResultDialog";
import type { OrderTableRow } from "@/features/dashboard/types/orderTableTypes";
import { Button } from "@/components/ui/button";
import { bankersRound } from "@/lib/utils";
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

type OrdersTableProps = {
  initialOrders: Order[];
  initialCustomers: Customer[];
  initialInventory: Inventory[];
};

const orderTableColumns = [
  { key: "order", label: "Order" },
  { key: "subOrder", label: "Sub Order" },
  { key: "itemId", label: "Item ID" },
  { key: "warehouseId", label: "Warehouse ID" },
  { key: "supplierId", label: "Supplier ID" },
  { key: "request", label: "Request" },
  { key: "type", label: "Type" },
  { key: "createDate", label: "Create Date" },
  { key: "customerId", label: "Customer ID" },
  { key: "remark", label: "Remark" },
] as const;

const sortByColumns = orderTableColumns.filter((column) =>
  ["order", "type", "createDate", "customerId"].includes(
    column.key
  )
);

type SortByKey = (typeof sortByColumns)[number]["key"];
type SortOrder = "asc" | "desc";

export function OrdersTable({
  initialOrders,
  initialCustomers,
  initialInventory,
}: OrdersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rows = useMemo<OrderTableRow[]>(
    () =>
      initialOrders.flatMap((order) =>
        order.subOrders.map((subOrder) => ({
          orderId: order.orderId,
          customerId: order.customerId,
          createdAt: order.createdAt,
          ...subOrder,
        }))
      ),
    [initialOrders]
  );

  const [selectedRow, setSelectedRow] =
    useState<OrderTableRow | null>(null);
  const [allocatedMap, setAllocatedMap] = useState<
    Record<string, number>
  >({});
  const [customerSpentMap, setCustomerSpentMap] =
    useState<Record<string, number>>({});
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<SortByKey>("order");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isAutoPreviewOpen, setIsAutoPreviewOpen] =
    useState(false);
  const [autoPreviewRows, setAutoPreviewRows] = useState<
    AutoPreviewRow[]
  >([]);
  const [pendingAutoAllocated, setPendingAutoAllocated] =
    useState<Record<string, number>>({});
  const [pendingAutoSpent, setPendingAutoSpent] = useState<
    Record<string, number>
  >({});
  const [isEditingFromPreview, setIsEditingFromPreview] =
    useState(false);
  const [isResetSuccessOpen, setIsResetSuccessOpen] =
    useState(false);
  const [isEditDialogLoading, setIsEditDialogLoading] =
    useState(false);
  const [isAutoPreviewLoading, setIsAutoPreviewLoading] =
    useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] =
    useState(false);
  const sortByKeys = sortByColumns.map((column) => column.key);
  const hasAllocationChanges =
    Object.keys(allocatedMap).length > 0 ||
    Object.keys(customerSpentMap).length > 0 ||
    Object.keys(pendingAutoAllocated).length > 0 ||
    Object.keys(pendingAutoSpent).length > 0;
  const hasUnallocatedRows = useMemo(
    () =>
      rows.some((row) => {
        const allocatedQty =
          allocatedMap[row.subOrderId] ?? row.allocatedQty;
        return allocatedQty < row.requestedQty;
      }),
    [rows, allocatedMap]
  );

  const searchFilteredRows = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) => {
      return (
        row.orderId.toLowerCase().includes(keyword) ||
        row.subOrderId.toLowerCase().includes(keyword) ||
        row.customerId.toLowerCase().includes(keyword)
      );
    });
  }, [rows, searchText]);

  const filteredRows = useMemo(() => {
    if (!fromDate && !toDate) return searchFilteredRows;

    const fromTime = fromDate
      ? new Date(`${fromDate}T00:00:00`).getTime()
      : null;
    const toTime = toDate
      ? new Date(`${toDate}T23:59:59.999`).getTime()
      : null;

    return searchFilteredRows.filter((row) => {
      const rowTime = new Date(row.createdAt).getTime();

      if (fromTime !== null && toTime !== null) {
        return rowTime >= fromTime && rowTime <= toTime;
      }

      if (fromTime !== null) {
        return rowTime >= fromTime;
      }

      return toTime !== null ? rowTime <= toTime : true;
    });
  }, [searchFilteredRows, fromDate, toDate]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows].sort((a, b) => {
      const orderTypeRank: Record<string, number> = {
        EMERGENCY: 3,
        OVERDUE: 2,
        DAILY: 1,
      };

      const getValue = (row: OrderTableRow) => {
        if (sortBy === "order") return row.orderId;
        if (sortBy === "subOrder") return row.subOrderId;
        if (sortBy === "itemId") return row.itemId;
        if (sortBy === "warehouseId") return row.warehouseId;
        if (sortBy === "supplierId") return row.supplierId;
        if (sortBy === "request") return row.requestedQty;
        if (sortBy === "type")
          return orderTypeRank[row.orderType] ?? 0;
        if (sortBy === "createDate")
          return new Date(row.createdAt).getTime();
        return row.customerId;
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (sortBy === "type" && aValue === bValue) {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "customerId" && aValue === bValue) {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      return String(aValue).localeCompare(String(bValue));
    });

    if (sortOrder === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [filteredRows, sortBy, sortOrder]);

  const pageSize = 50;
  const totalPages = Math.ceil(sortedRows.length / pageSize);

  const rawPage = Number(searchParams.get("page") ?? "1");
  const safePage = Number.isNaN(rawPage) ? 1 : rawPage;
  const currentPage = Math.min(
    Math.max(safePage, 1),
    totalPages
  );

  useEffect(() => {
    if (searchParams.get("page")) return;
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set("page", "1");
    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  }, [pathname, router, searchParams]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set("page", String(page));

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  };

  const resetToFirstPage = () => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set("page", "1");

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageRows = sortedRows.slice(startIndex, endIndex);

  const handleAllocateCommit = (
    subOrderId: string,
    nextAllocatedQty: number,
    customerId: string,
    unitPrice: number
  ) => {
    if (isEditingFromPreview) {
      const rowData = rows.find(
        (row) => row.subOrderId === subOrderId
      );
      if (!rowData) return;

      const baseAllocatedQty =
        allocatedMap[subOrderId] ?? rowData.allocatedQty;
      const prevDelta = pendingAutoAllocated[subOrderId] ?? 0;
      const prevAllocatedQty = baseAllocatedQty + prevDelta;
      const diffQty = nextAllocatedQty - prevAllocatedQty;
      const nextDelta = Math.max(
        0,
        nextAllocatedQty - baseAllocatedQty
      );
      const spendDiff = bankersRound(diffQty * unitPrice);

      setPendingAutoAllocated((prev) => ({
        ...prev,
        [subOrderId]: nextDelta,
      }));

      setPendingAutoSpent((prev) => ({
        ...prev,
        [customerId]: bankersRound(
          Math.max(0, (prev[customerId] ?? 0) + spendDiff)
        ),
      }));

      setAutoPreviewRows((prev) => {
        if (nextDelta <= 0) {
          return prev.filter(
            (item) => item.subOrderId !== subOrderId
          );
        }

        const exists = prev.some(
          (item) => item.subOrderId === subOrderId
        );

        if (!exists) {
          return [
            ...prev,
            {
              subOrderId: rowData.subOrderId,
              orderId: rowData.orderId,
              customerId: rowData.customerId,
              orderType: rowData.orderType,
              allocateQty: nextDelta,
              requestedQty: rowData.requestedQty,
              createdAt: rowData.createdAt,
            },
          ];
        }

        return prev.map((item) =>
          item.subOrderId === subOrderId
            ? { ...item, allocateQty: nextDelta }
            : item
        );
      });

      return;
    }

    const prevAllocatedQty =
      allocatedMap[subOrderId] ??
      rows.find((row) => row.subOrderId === subOrderId)
        ?.allocatedQty ??
      0;
    const diffQty = nextAllocatedQty - prevAllocatedQty;

    setCustomerSpentMap((prev) => ({
      ...prev,
      [customerId]: bankersRound(
        Math.max(
          0,
          (prev[customerId] ?? 0) + diffQty * unitPrice
        )
      ),
    }));

    setAllocatedMap((prev) => ({
      ...prev,
      [subOrderId]: nextAllocatedQty,
    }));
  };

  const getOrderTypeMultiplier = (orderType: string) => {
    if (orderType === "EMERGENCY") return 1.25;
    if (orderType === "OVERDUE") return 1;
    return 0.9;
  };

  const handleAutoAllocate = useCallback(() => {
    setIsAutoPreviewLoading(true);
    setIsAutoPreviewOpen(true);

    setTimeout(() => {
      const nextAllocated: Record<string, number> = {};
      const nextSpent: Record<string, number> = {};
      const previewRows: AutoPreviewRow[] = [];

      const stockRemaining = new Map<string, number>();
      const creditRemaining = new Map<string, number>();

      for (const item of initialInventory) {
        const key = `${item.itemId}|${item.warehouseId}|${item.supplierId}`;
        stockRemaining.set(key, item.availableStock);
      }

      for (const customer of initialCustomers) {
        creditRemaining.set(
          customer.customerId,
          customer.availableCredit
        );
      }

      for (const [customerId, spent] of Object.entries(
        customerSpentMap
      )) {
        const remain = creditRemaining.get(customerId) ?? 0;
        creditRemaining.set(
          customerId,
          bankersRound(Math.max(0, remain - spent))
        );
      }

      const orderTypePriority: Record<string, number> = {
        EMERGENCY: 1,
        OVERDUE: 2,
        DAILY: 3,
      };

      const autoRows = [...filteredRows].sort((a, b) => {
        const aPriority = orderTypePriority[a.orderType] ?? 99;
        const bPriority = orderTypePriority[b.orderType] ?? 99;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      });

      for (const row of autoRows) {
        const baseAllocated =
          allocatedMap[row.subOrderId] ?? row.allocatedQty;
        const requestedRemaining = Math.max(
          0,
          row.requestedQty - baseAllocated
        );

        if (requestedRemaining <= 0) continue;

        let candidates = initialInventory.filter(
          (item) => item.itemId === row.itemId
        );

        if (row.warehouseId !== "WH-000") {
          candidates = candidates.filter(
            (item) => item.warehouseId === row.warehouseId
          );
        }

        if (row.supplierId !== "SP-000") {
          candidates = candidates.filter(
            (item) => item.supplierId === row.supplierId
          );
        }

        if (candidates.length === 0) continue;

        const best = candidates
          .map((item) => {
            const key = `${item.itemId}|${item.warehouseId}|${item.supplierId}`;
            return {
              item,
              key,
              remain: stockRemaining.get(key) ?? 0,
            };
          })
          .sort((a, b) => b.remain - a.remain)[0];

        if (!best || best.remain <= 0) continue;

        const unitPrice = bankersRound(
          best.item.pricePerUnit *
            getOrderTypeMultiplier(row.orderType)
        );
        const customerCredit = creditRemaining.get(row.customerId) ?? 0;
        const maxByCredit =
          unitPrice > 0
            ? Math.floor(customerCredit / unitPrice)
            : Number.MAX_SAFE_INTEGER;

        const allocateQty = Math.min(
          requestedRemaining,
          best.remain,
          Math.max(0, maxByCredit)
        );

        if (allocateQty <= 0) continue;

        const spend = bankersRound(allocateQty * unitPrice);

        nextAllocated[row.subOrderId] =
          (nextAllocated[row.subOrderId] ?? 0) + allocateQty;
        nextSpent[row.customerId] =
          (nextSpent[row.customerId] ?? 0) + spend;

        stockRemaining.set(best.key, best.remain - allocateQty);
        creditRemaining.set(
          row.customerId,
          bankersRound(Math.max(0, customerCredit - spend))
        );

        previewRows.push({
          subOrderId: row.subOrderId,
          orderId: row.orderId,
          customerId: row.customerId,
          orderType: row.orderType,
          allocateQty,
          requestedQty: row.requestedQty,
          createdAt: row.createdAt,
        });
      }

      setPendingAutoAllocated(nextAllocated);
      setPendingAutoSpent(nextSpent);
      setAutoPreviewRows(previewRows);
      setIsAutoPreviewLoading(false);
    }, 250);
  }, [
    initialInventory,
    initialCustomers,
    customerSpentMap,
    filteredRows,
    allocatedMap,
  ]);

  useEffect(() => {
    if (hasAutoTriggered) return;
    if (rows.length === 0) return;
    if (!hasUnallocatedRows) return;

    const timerId = setTimeout(() => {
      handleAutoAllocate();
      setHasAutoTriggered(true);
    }, 0);

    return () => clearTimeout(timerId);
  }, [
    hasAutoTriggered,
    rows.length,
    hasUnallocatedRows,
    handleAutoAllocate,
  ]);

  const confirmAutoAllocate = () => {
    setAllocatedMap((prev) => {
      const merged = { ...prev };
      for (const [subOrderId, qty] of Object.entries(
        pendingAutoAllocated
      )) {
        merged[subOrderId] = (merged[subOrderId] ?? 0) + qty;
      }
      return merged;
    });

    setCustomerSpentMap((prev) => {
      const merged = { ...prev };
      for (const [customerId, spend] of Object.entries(
        pendingAutoSpent
      )) {
        merged[customerId] = bankersRound(
          (merged[customerId] ?? 0) + spend
        );
      }
      return merged;
    });

    setIsAutoPreviewOpen(false);
    setAutoPreviewRows([]);
    setPendingAutoAllocated({});
    setPendingAutoSpent({});
  };

  const cancelAutoAllocate = () => {
    setIsAutoPreviewOpen(false);
    setIsAutoPreviewLoading(false);
    setAutoPreviewRows([]);
    setPendingAutoAllocated({});
    setPendingAutoSpent({});
  };

  const handleResetAllocation = () => {
    setAllocatedMap({});
    setCustomerSpentMap({});
    setPendingAutoAllocated({});
    setPendingAutoSpent({});
    setAutoPreviewRows([]);
    setIsAutoPreviewOpen(false);
    setSelectedRow(null);
    setIsEditingFromPreview(false);
    setIsResetSuccessOpen(true);
  };

  const handlePreviewEditRow = (subOrderId: string) => {
    const targetRow = rows.find(
      (item) => item.subOrderId === subOrderId
    );
    if (!targetRow) return;
    setIsEditingFromPreview(true);
    setIsEditDialogLoading(true);
    setSelectedRow(targetRow);
    setTimeout(() => setIsEditDialogLoading(false), 250);
  };

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
            placeholder="Search Order / Sub Order / Customer"
            className="h-10 w-full rounded-md border px-3 text-sm sm:col-span-2 xl:w-64"
          />

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Sort By:
            </span>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (sortByKeys.includes(value as SortByKey)) {
                  setSortBy(value as SortByKey);
                  resetToFirstPage();
                }
              }}
            >
              <SelectTrigger className="h-8 w-full min-w-[220px] border-0 px-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortByColumns.map((column) => (
                  <SelectItem key={column.key} value={column.key}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Order:
            </span>
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

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              From:
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => {
                setFromDate(event.target.value);
                resetToFirstPage();
              }}
              className="h-8 min-w-[150px] bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              To:
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => {
                setToDate(event.target.value);
                resetToFirstPage();
              }}
              className="h-8 min-w-[150px] bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
          <Button
            variant="outline"
            onClick={handleAutoAllocate}
            className="w-full sm:w-auto"
          >
            Auto
          </Button>
          <Button
            variant="outline"
            onClick={handleResetAllocation}
            className="w-full sm:w-auto"
            disabled={!hasAllocationChanges}
          >
            Reset Allocation
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {orderTableColumns.map((column) => (
              <TableHead
                key={column.key}
                className={
                  column.key === "request" ? "text-right" : undefined
                }
              >
                {column.label}
              </TableHead>
            ))}

            <TableHead className="text-center">
              Edit
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageRows.map((row) => {
            const allocatedQty =
              allocatedMap[row.subOrderId] ?? row.allocatedQty;
            const isCompleted = allocatedQty >= row.requestedQty;

            return (
            <TableRow
              key={row.subOrderId}
              className={isCompleted ? "bg-emerald-50" : ""}
            >
              <TableCell>
                {row.orderId}
              </TableCell>

              <TableCell>
                {row.subOrderId}
              </TableCell>

              <TableCell>
                {row.itemId}
              </TableCell>

              <TableCell>
                {row.warehouseId}
              </TableCell>

              <TableCell>
                {row.supplierId}
              </TableCell>

              <TableCell className="text-right">
                {allocatedQty}/{row.requestedQty}
              </TableCell>

              <TableCell>
                <OrderTypeBadge orderType={row.orderType} />
              </TableCell>

              <TableCell>
                {new Date(
                  row.createdAt
                ).toLocaleDateString()}
              </TableCell>

              <TableCell>
                {row.customerId}
              </TableCell>

              <TableCell>
                {row.remark}
              </TableCell>

              <TableCell className="text-center">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-muted"
                  aria-label={`Edit ${row.subOrderId}`}
                  onClick={() => {
                    setIsEditingFromPreview(false);
                    setIsEditDialogLoading(true);
                    setSelectedRow(row);
                    setTimeout(
                      () => setIsEditDialogLoading(false),
                      250
                    );
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          );})}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <OrderEditDialog
        row={selectedRow}
        customersData={initialCustomers}
        inventoryData={initialInventory}
        customerId={selectedRow?.customerId ?? null}
        itemId={selectedRow?.itemId ?? null}
        currentAllocatedQty={
          selectedRow
            ? (allocatedMap[selectedRow.subOrderId] ??
                selectedRow.allocatedQty) +
              (isEditingFromPreview
                ? pendingAutoAllocated[selectedRow.subOrderId] ?? 0
                : 0)
            : 0
        }
        currentCustomerSpent={
          selectedRow
            ? bankersRound(
                (customerSpentMap[selectedRow.customerId] ?? 0) +
                  (isEditingFromPreview
                    ? pendingAutoSpent[selectedRow.customerId] ?? 0
                    : 0)
              )
            : 0
        }
        isLoading={isEditDialogLoading}
        onAllocateCommit={handleAllocateCommit}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRow(null);
            setIsEditingFromPreview(false);
          }
        }}
      />

      <AutoAllocationPreviewDialog
        open={isAutoPreviewOpen}
        rows={autoPreviewRows}
        isLoading={isAutoPreviewLoading}
        onEditRow={handlePreviewEditRow}
        onConfirm={confirmAutoAllocate}
        onCancel={cancelAutoAllocate}
        onOpenChange={setIsAutoPreviewOpen}
      />

      <ActionResultDialog
        open={isResetSuccessOpen}
        onOpenChange={setIsResetSuccessOpen}
        title="Reset Completed"
        description="Allocation data has been reset successfully."
      />
    </div>
  );
}
