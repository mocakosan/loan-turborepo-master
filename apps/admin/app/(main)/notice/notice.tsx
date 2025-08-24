"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { GetNotices } from "@/actions/admin/get-notices";

type Props = {
  notices: GetNotices["notices"];
  meta: GetNotices["meta"];
};

export default function Notice({ notices, meta }: Props) {
  const router = useRouter();

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    router.push(`/notice/${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();

              router.push(`/notice/add`);
            }}
          >
            글쓰기
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20 text-center font-medium">
                No.
              </TableHead>
              <TableHead className="text-center font-medium">제목</TableHead>
              <TableHead className="w-32 text-center font-medium">
                작성일
              </TableHead>
              <TableHead className="w-20 text-center font-medium">
                관리
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-center">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  router.push(`/notice?page=${meta?.previousPage || 1}`);
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

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const pageNum = startPage + i;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => {
                        router.push(`/notice?page=${pageNum}`);
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
              });
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  router.push(`/notice?page=${meta?.nextPage || 1}`);
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
  );
}
