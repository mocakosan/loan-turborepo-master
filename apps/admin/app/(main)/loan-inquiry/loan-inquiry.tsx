"use client";

import type React from "react";

import { useState } from "react";
import { Search, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GetLoanInquiries } from "@/actions/admin/get-loan-inquiries";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type Props = {
  loanInquiries: GetLoanInquiries["loanInquiries"];
  meta: GetLoanInquiries["meta"];
};

export default function LoanInquiry({ loanInquiries, meta }: Props) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<number | null>(243);

  const handleRowClick = (id: number) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/loan-inquiry/${id}`);
  };

  const handleSearch = () => {
    router.push(`/loan-inquiry?q=${searchTerm}&page=1`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            실시간 대출문의 현황
          </h1>

          {/* 검색바 */}
          <div className="relative w-80">
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-gray-200">
                <TableHead className="w-20 text-center font-semibold text-gray-700">
                  No.
                </TableHead>
                <TableHead className="w-32 text-center font-semibold text-gray-700">
                  지역
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  제목
                </TableHead>
                <TableHead className="w-40 text-center font-semibold text-gray-700">
                  작성자
                </TableHead>
                <TableHead className="w-32 text-center font-semibold text-gray-700">
                  작성일
                </TableHead>
                <TableHead className="w-20 text-center font-semibold text-gray-700">
                  관리
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanInquiries.map((item) => (
                <TableRow
                  key={item.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedRow === item.id
                      ? "bg-blue-50 ring-2 ring-blue-300"
                      : ""
                  }`}
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="text-center font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.regionKind.name}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {format(item.createdAt, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEdit(item.id, e)}
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    router.push(
                      `/loan-inquiry?page=${meta?.previousPage || 1}`
                    );
                  }}
                  className={
                    meta?.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {(() => {
                // 동적으로 페이지 범위 계산
                const totalPage = meta?.pageCount || 1;
                const currentPage = meta?.currentPage || 1;

                const pageWindow = 5; // 보여줄 최대 페이지 수
                let startPage = Math.max(
                  currentPage - Math.floor(pageWindow / 2),
                  1
                );
                let endPage = startPage + pageWindow - 1;

                if (endPage > totalPage) {
                  endPage = totalPage;
                  startPage = Math.max(endPage - pageWindow + 1, 1);
                }

                return Array.from(
                  { length: endPage - startPage + 1 },
                  (_, i) => {
                    const pageNum = startPage + i;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => {
                            router.push(`/loan-inquiry?page=${pageNum}`);
                          }}
                          isActive={meta?.currentPage === pageNum}
                          className={
                            meta?.currentPage === pageNum
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "cursor-pointer"
                          }
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    router.push(`/loan-inquiry?page=${meta?.nextPage || 1}`);
                  }}
                  className={
                    meta?.currentPage === (meta?.pageCount || 0)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
