"use client";

import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActionResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  showSuccessIcon?: boolean;
};

export function ActionResultDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "OK",
  showSuccessIcon = false,
}: ActionResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader
          className={
            showSuccessIcon ? "items-center text-center" : undefined
          }
        >
          {showSuccessIcon ? (
            <CircleCheckBig className="h-12 w-12 text-emerald-600" />
          ) : null}
          <DialogTitle
            className={
              showSuccessIcon
                ? "text-xl font-bold text-emerald-700"
                : undefined
            }
          >
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
