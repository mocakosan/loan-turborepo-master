"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SortingState } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  pageSize?: number;
  sorting: SortingState;
}

export default function DataTablePagination({
  totalPages,
  pageSize = 4,
  sorting,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  const pathname = usePathname();

  const currentPage = Number(search.page) || 1;

  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?page=${page}&s_id=${sorting[0].id}&s_desc=${sorting[0].desc}`,
    );
  };

  // 현재 페이지 기준으로 표시할 페이지 번호 범위 설정
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + (pageSize - 1));

  // 마지막 페이지에 가까워지면 뒤쪽 페이지가 보이도록 startPage 조정
  if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - (pageSize - 1));
    endPage = totalPages;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {/* 표시할 페이지 번호 */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i,
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className={cn("cursor-pointer", currentPage === page && "border")}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
