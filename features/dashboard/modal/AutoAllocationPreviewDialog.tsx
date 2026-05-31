"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { OrderTypeBadge } from "@/components/OrderTypeBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AutoPreviewRow = {
  subOrderId: string;
  orderId: string;
  customerId: string;
  orderType: string;
  allocateQty: number;
  requestedQty: number;
  createdAt: string;
};

type AutoAllocationPreviewDialogProps = {
  open: boolean;
  rows: AutoPreviewRow[];
  isLoading?: boolean;
  onEditRow: (subOrderId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
};

export function AutoAllocationPreviewDialog({
  open,
  rows,
  isLoading = false,
  onEditRow,
  onConfirm,
  onCancel,
  onOpenChange,
}: AutoAllocationPreviewDialogProps) {
  const [previewPage, setPreviewPage] = useState(1);
  const previewPageSize = 10;

  const previewTotalPages = Math.max(
    1,
    Math.ceil(rows.length / previewPageSize)
  );
  const safePreviewPage = Math.min(
    Math.max(previewPage, 1),
    previewTotalPages
  );

  const previewRows = useMemo(() => {
    const previewStartIndex = (safePreviewPage - 1) * previewPageSize;
    const previewEndIndex = previewStartIndex + previewPageSize;
    return rows.slice(previewStartIndex, previewEndIndex);
  }, [rows, safePreviewPage]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setPreviewPage(1);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Allocation Preview</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2 rounded-md border p-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="max-h-[45vh] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Sub Order</TableHead>
                  <TableHead className="text-right">Request</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Create Date</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No allocation changes
                    </TableCell>
                  </TableRow>
                )}
                {previewRows.map((item) => (
                  <TableRow key={item.subOrderId}>
                    <TableCell>{item.orderId}</TableCell>
                    <TableCell>{item.subOrderId}</TableCell>
                    <TableCell className="text-right">
                      {item.allocateQty}/{item.requestedQty}
                    </TableCell>
                    <TableCell>
                      <OrderTypeBadge orderType={item.orderType} />
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.customerId}</TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded border hover:bg-muted"
                        aria-label={`Edit ${item.subOrderId}`}
                        onClick={() => onEditRow(item.subOrderId)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          currentPage={safePreviewPage}
          totalPages={previewTotalPages}
          onPageChange={setPreviewPage}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setPreviewPage(1);
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setPreviewPage(1);
              onConfirm();
            }}
          >
            Confirm Allocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
