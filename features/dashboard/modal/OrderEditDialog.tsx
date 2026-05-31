"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bankersRound } from "@/lib/utils";
import { OrderTypeBadge } from "@/components/OrderTypeBadge";
import { ActionResultDialog } from "@/components/ActionResultDialog";
import { Skeleton } from "@/components/ui/skeleton";

import type { OrderTableRow } from "@/features/dashboard/types/orderTableTypes";
import type { Customer } from "@/mock/customer";
import type { Inventory } from "@/mock/inventory";

type OrderEditDialogProps = {
  row: OrderTableRow | null;
  customersData: Customer[];
  inventoryData: Inventory[];
  customerId: string | null;
  itemId: string | null;
  currentAllocatedQty: number;
  currentCustomerSpent: number;
  isLoading?: boolean;
  onAllocateCommit: (
    subOrderId: string,
    nextAllocatedQty: number,
    customerId: string,
    unitPrice: number
  ) => void;
  onOpenChange: (open: boolean) => void;
};

export function OrderEditDialog({
  row,
  customersData,
  inventoryData,
  customerId,
  currentAllocatedQty,
  currentCustomerSpent,
  isLoading = false,
  onAllocateCommit,
  onOpenChange,
}: OrderEditDialogProps) {
  const pickMaxStock = (list: Inventory[]) => {
    if (list.length === 0) return null;

    return list.reduce((best, current) => {
      if (current.availableStock > best.availableStock) {
        return current;
      }

      return best;
    });
  };

  const stockfind = (row: OrderTableRow | null) => {
    if (!row) return null;

    let candidates = [];

    if (
      row.warehouseId === "WH-000" &&
      row.supplierId === "SP-000"
    ) {
      candidates = inventoryData.filter(
        (item) => 
          item.itemId === row.itemId &&
          item.warehouseId !== "WH-000" &&
          item.supplierId !== "SP-000"
      );
    } else if (row.warehouseId === "WH-000") {
      candidates = inventoryData.filter(
        (item) =>
          item.itemId === row.itemId &&
          item.supplierId === row.supplierId &&
          item.warehouseId !== "WH-000"
      );
    } else if (row.supplierId === "SP-000") {
      candidates = inventoryData.filter(
        (item) =>
          item.itemId === row.itemId &&
          item.warehouseId === row.warehouseId &&
          item.supplierId !== "SP-000"
      );
    } else {
      candidates = inventoryData.filter(
        (item) =>
          item.itemId === row.itemId &&
          item.warehouseId === row.warehouseId &&
          item.supplierId === row.supplierId
      );
    }

    return pickMaxStock(candidates);
  };

  const customer = customerId
    ? customersData.find((item) => item.customerId === customerId)
    : undefined;

  const stock = stockfind(row);
  const committedQty = currentAllocatedQty;

  const unitPrice = stock?.pricePerUnit ?? 0;
  const baseStock = stock?.availableStock ?? 0;
  const baseUsedCredit = customer?.usedCredit ?? 0;
  const baseAvailableCredit = customer?.availableCredit ?? 0;

  const availableStockNow = Math.max(0, baseStock - committedQty);
  const usedCreditNow = bankersRound(
    baseUsedCredit + currentCustomerSpent
  );
  const availableCreditNow = Math.max(
    0,
    bankersRound(baseAvailableCredit - currentCustomerSpent)
  );
  const requestedQty = row?.requestedQty ?? 0;
  const createdAt = row ? new Date(row.createdAt) : null;

  const dateText = createdAt
    ? createdAt.toLocaleDateString("en-GB")
    : "-";

  const timeText = createdAt
    ? createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const handleAllocateSubmit = (
    nextAllocatedQty: number,
    effectiveUnitPrice: number
  ) => {
    if (!row || !stock || !customer) return;
    onAllocateCommit(
      row.subOrderId,
      nextAllocatedQty,
      row.customerId,
      effectiveUnitPrice
    );
  };

  return (
    <Dialog open={row !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Information
          </DialogTitle>
        </DialogHeader>

        {row && isLoading && (
          <div className="max-h-[76vh] space-y-5 overflow-y-auto pr-1">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {row && !isLoading && (
          <div className="max-h-[76vh] space-y-5 overflow-y-auto pr-1">
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <InfoRow label="Order ID" value={row.orderId} />
                <InfoRow label="Sub Order ID" value={row.subOrderId} />
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <p className="font-semibold text-foreground">Order Type</p>
                  <div>
                    <OrderTypeBadge orderType={row.orderType} />
                  </div>
                </div>
                <InfoRow label="Order Date" value={dateText} />
                <InfoRow label="Order Time" value={timeText} />
                <InfoRow label="Item" value={row.itemId} />
                <InfoRow label="Warehouse" value={row.warehouseId} />
                <InfoRow label="Supplier" value={row.supplierId} />
                <InfoRow
                  label="Requested"
                  value={row.requestedQty.toLocaleString()}
                />
                <InfoRow
                  label="Allocated"
                  value={`${committedQty.toLocaleString()}/${row.requestedQty.toLocaleString()}`}
                />
                <InfoRow label="Remark" value={row.remark || "-"} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <section className="rounded-lg border bg-background p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Customer
                </h3>

                <div className="space-y-3 text-sm">
                  <InfoRow label="Customer ID" value={customerId || "-"} />
                  <InfoRow
                    label="Customer Name"
                    value={customer?.customerName || "-"}
                  />
                  <InfoRow
                    label="Credit Limit"
                    value={
                      customer
                        ? `${customer.creditLimit.toLocaleString()} THB`
                        : "-"
                    }
                  />
                  <InfoRow
                    label="Used Credit"
                    value={
                      customer
                        ? `${usedCreditNow.toLocaleString()} THB`
                        : "-"
                    }
                  />
                  <InfoRow
                    label="Available Credit"
                    value={
                      customer
                        ? `${availableCreditNow.toLocaleString()} THB`
                        : "-"
                    }
                  />
                </div>
              </section>

              <section className="rounded-lg border bg-background p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Stock
                </h3>

                {!stock && (
                  <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-center text-base font-bold text-red-700">
                    STOCK NOT AVAILABLE
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <InfoRow
                    label="Item"
                    value={stock ? stock.itemId : "-"}
                  />
                  <InfoRow
                    label="Warehouse"
                    value={stock ? stock.warehouseId : "-"}
                  />
                  <InfoRow
                    label="Supplier"
                    value={stock ? stock.supplierId : "-"}
                  />
                  <InfoRow
                    label="Available Stock"
                    value={
                      stock
                        ? availableStockNow.toLocaleString()
                        : "-"
                    }
                  />
                  <InfoRow
                    label="Price / Unit"
                    value={
                      stock
                        ? `${stock.pricePerUnit.toLocaleString()} THB`
                        : "-"
                    }
                  />
                </div>
              </section>
            </div>

            {stock && (
              <section className="rounded-lg border bg-background p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Allocate
                </h3>
                <AllocateSection
                  key={row.subOrderId}
                  orderType={row.orderType}
                  requestedQty={requestedQty}
                  availableStock={availableStockNow}
                  unitPrice={unitPrice}
                  availableCredit={availableCreditNow}
                  currentAllocatedQty={committedQty}
                  onSubmit={handleAllocateSubmit}
                />
              </section>
            )}

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-foreground/90">{value}</p>
    </div>
  );
}

type AllocateSectionProps = {
  orderType: string;
  requestedQty: number;
  availableStock: number;
  unitPrice: number;
  availableCredit: number;
  currentAllocatedQty: number;
  onSubmit: (
    nextAllocatedQty: number,
    effectiveUnitPrice: number
  ) => void;
};

function AllocateSection({
  orderType,
  requestedQty,
  availableStock,
  unitPrice,
  availableCredit,
  currentAllocatedQty,
  onSubmit,
}: AllocateSectionProps) {
  const [allocateInput, setAllocateInput] = useState(
    String(currentAllocatedQty)
  );
  const [errorText, setErrorText] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedQty, setSubmittedQty] = useState(0);
  const priceMultiplierMap: Record<string, number> = {
    EMERGENCY: 1.25,
    OVERDUE: 1.0,
    DAILY: 0.9,
  };

  const priceMultiplier = priceMultiplierMap[orderType] ?? 1.0;
  const effectiveUnitPrice = bankersRound(
    unitPrice * priceMultiplier
  );

  const totalStockCapacity = availableStock + currentAllocatedQty;
  const creditCapacity = bankersRound(
    availableCredit + currentAllocatedQty * effectiveUnitPrice
  );

  const maxByCredit =
    effectiveUnitPrice > 0
      ? Math.floor(creditCapacity / effectiveUnitPrice)
      : Number.MAX_SAFE_INTEGER;

  const maxAllocate = Math.min(
    requestedQty,
    totalStockCapacity,
    maxByCredit
  );

  const allocateQty = useMemo(() => {
    const parsed = Number(allocateInput);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return Math.floor(parsed);
  }, [allocateInput]);

  const totalPrice = bankersRound(
    allocateQty * effectiveUnitPrice
  );
  const remainingStock = totalStockCapacity - allocateQty;
  const unallocatedQty = requestedQty - allocateQty;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="allocateQty"
            className="font-semibold text-foreground"
          >
            Allocate Qty
          </label>
          <input
            id="allocateQty"
            type="text"
            className="h-10 rounded-md border bg-background px-3"
            value={allocateInput}
            onChange={(event) => {
              const raw = event.target.value;

              if (raw === "") {
                setAllocateInput("");
                setErrorText("");
                return;
              }

              if (!/^\d+$/.test(raw)) {
                setAllocateInput("");
                setErrorText("");
                return;
              }

              const parsed = Number(raw);
              if (Number.isNaN(parsed)) return;

               const nextValue = Math.floor(parsed);

              if (nextValue < 0) {
                setAllocateInput("");
                setErrorText("* กรุณากรอกจำนวนที่มากกว่าหรือเท่ากับ 0");
                return;
              }

              if (nextValue > requestedQty) {
                setAllocateInput("");
                setErrorText("* จำนวนเกิน Requested");
                return;
              }

              if (nextValue > totalStockCapacity) {
                setAllocateInput("");
                setErrorText("* จำนวนเกิน Available Stock");
                return;
              }

              if (nextValue > maxByCredit) {
                setAllocateInput("");
                setErrorText("* จำนวนเกินวงเงิน Available Credit");
                return;
              }

              setAllocateInput(String(nextValue));
              setErrorText("");
            }}
          />
                {errorText && (
            <p className="text-xs font-medium text-red-600">
              {errorText}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Requested: {requestedQty.toLocaleString()} | Stock: {totalStockCapacity.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Available Credit: {creditCapacity.toLocaleString()} THB
          </p>

    
        </div>

        <div className="space-y-3 rounded-md border bg-muted/20 p-3 text-sm">
          <InfoRow
            label="Unit Price"
            value={`${unitPrice.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} THB`}
          />

          <div className="grid grid-cols-[140px_1fr] gap-2">
            <p className="font-semibold text-foreground">Order Type</p>
            <div>
              <OrderTypeBadge orderType={orderType} />
            </div>
          </div>

          <InfoRow
            label="Adjusted Price"
            value={`${effectiveUnitPrice.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} THB`}
          />
          <InfoRow
            label="Total Price"
            value={`${totalPrice.toLocaleString()} THB`}
          />
          <InfoRow
            label="Remaining Stock"
            value={remainingStock.toLocaleString()}
          />
          <InfoRow
            label="Unallocated Qty"
            value={unallocatedQty.toLocaleString()}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Max allocate: {maxAllocate.toLocaleString()}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={
            !!errorText ||
            (allocateQty === 0 && currentAllocatedQty === 0)
          }
          onClick={() => {
            if (allocateQty === 0 && currentAllocatedQty === 0) {
              setErrorText("* กรุณากรอกจำนวนที่มากกว่า 0");
              return;
            }

            onSubmit(allocateQty, effectiveUnitPrice);
            setAllocateInput(String(allocateQty));
            setErrorText("");
            setSubmittedQty(allocateQty);
            setIsSuccessOpen(true);
          }}
        >
          Submit
        </button>
      </div>

      <ActionResultDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title="Success"
        description={`Allocated quantity ${submittedQty.toLocaleString()} has been saved successfully.`}
        confirmText="OK"
        showSuccessIcon
      />

    </>
  );
}
