"use client";

import { useState, useTransition } from "react";
import { Search, Trash2, Plus, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetFinancialNewsList } from "@/actions/admin/get-financial-news-list";
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
import { deleteFinancialNews } from "@/actions/admin/delete-financial-news";
import { createFinancialNews } from "@/actions/admin/create-financial-news";
import { toast } from "sonner";

type Props = {
  financialNewsList: GetFinancialNewsList["financialNewsList"];
  meta: GetFinancialNewsList["meta"];
};

export default function FinancialNews({ financialNewsList, meta }: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");

  const handleDelete = (id: number) => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    startTransition(() => {
      deleteFinancialNews(id);
    });
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!newLink.trim()) {
      toast.error("링크를 입력해주세요.");
      return;
    }

    startTransition(() => {
      createFinancialNews({
        title: newTitle,
        link: newLink,
      });

      setNewTitle("");
      setNewLink("");
    });
  };

  const handleSearch = () => {
    router.push(`/financial-news?q=${searchQuery}&page=1`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">금융권 소식</h1>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            onClick={handleSearch}
          />
          <Input
            placeholder="검색어를 입력해 주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
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
              <TableHead className="text-center font-medium">링크</TableHead>
              <TableHead className="w-32 text-center font-medium">
                작성일
              </TableHead>
              <TableHead className="w-20 text-center font-medium">
                삭제
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialNewsList.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-center">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-md"
                    >
                      {item.link}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {format(item.createdAt, "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add New Item Form */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1">
            <span className="font-medium text-gray-700">추가</span>
          </div>
          <div className="col-span-3">
            <Input
              placeholder="제목을 입력해주세요"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="col-span-7">
            <Input
              placeholder="https://www.youtube.com/watch?v=KeL68YShKq&list=PLWRKqUO5iWaDlle.Z6wBm..."
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="col-span-1">
            <Button
              onClick={handleAdd}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  router.push(
                    `/financial-news?page=${meta?.previousPage || 1}`
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

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const pageNum = startPage + i;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => {
                        router.push(`/financial-news?page=${pageNum}`);
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
                  router.push(`/financial-news?page=${meta?.nextPage || 1}`);
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
