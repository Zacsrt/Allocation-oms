"use client";

import { useMemo, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [pageInput, setPageInput] = useState("");

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    setPageInput("");
  };

  const visiblePages = useMemo(() => {
    const pages: Array<number | "..."> = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    const windowStart = Math.max(
      2,
      Math.min(currentPage - 1, totalPages - 3)
    );
    const windowEnd = windowStart + 2;

    if (windowStart > 2) {
      pages.push("...");
    }

    for (let page = windowStart; page <= windowEnd; page += 1) {
      if (page === 1 || page === totalPages) continue;
      pages.push(page);
    }

    if (windowEnd < totalPages) {
      pages.push("...");
      pages.push(totalPages);
    }

    return pages.filter(
      (value, index) =>
        !(value === "..." && pages[index - 1] === "...")
    );
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-wrap items-center gap-2 border-t px-3 py-3">
      <button
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </button>

      {visiblePages.map((pageNumber, index) => {
        if (pageNumber === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-1 text-sm">
              ...
            </span>
          );
        }

        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            className={`rounded border px-3 py-1 text-sm ${
              isActive ? "bg-black text-white" : "bg-white"
            }`}
            onClick={() => goToPage(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Go to page</span>
        <input
          className="w-16 rounded border px-2 py-1 text-sm"
          value={pageInput}
          placeholder={String(currentPage)}
          onChange={(event) => setPageInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            const page = Number(pageInput);
            if (Number.isNaN(page)) return;
            goToPage(page);
          }}
        />
        <button
          className="rounded border px-3 py-1 text-sm"
          onClick={() => {
            const page = Number(pageInput);
            if (Number.isNaN(page)) return;
            goToPage(page);
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
