"use client";

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
import { GetAdvertisingInquiries } from "@/actions/admin/get-advertising-inquiries";
import { AdvertisingInquiryStatus } from "@repo/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { updateAdvertisingInquiry } from "@/actions/admin/update-advertising-inquiry";
import { toast } from "sonner";

type Props = {
  advertisingInquiries: GetAdvertisingInquiries["advertisingInquiries"];
  meta: GetAdvertisingInquiries["meta"];
};

export default function AdvertisingInquiry({
  advertisingInquiries,
  meta,
}: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const statusOptions: { value: AdvertisingInquiryStatus; label: string }[] = [
    { value: "NEW_INQUIRY", label: "새로운 문의" },
    { value: "WAIT_DEPOSIT", label: "입금대기" },
    { value: "COMPLETE_DEPOSIT", label: "입금완료" },
    { value: "COMPLETE_UPLOAD", label: "업로드 완료" },
  ];

  const handleStatusChange = async (
    inquiryId: number,
    newStatus: AdvertisingInquiryStatus
  ) => {
    console.log({ inquiryId, newStatus });

    startTransition(async () => {
      const result = await updateAdvertisingInquiry(inquiryId, { newStatus });

      if (result.success) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">광고문의</h1>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center font-medium">No.</TableHead>
              <TableHead className="text-center font-medium">
                광고종류
              </TableHead>
              <TableHead className="text-center font-medium">
                문의시간
              </TableHead>
              <TableHead className="text-center font-medium">
                업체이름
              </TableHead>
              <TableHead className="text-center font-medium">연락처</TableHead>
              <TableHead className="text-center font-medium">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advertisingInquiries.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-center">{item.id}</TableCell>
                <TableCell className="text-center">
                  {item.advertisingInquiryKind}
                </TableCell>
                <TableCell className="text-center">
                  {format(item.createdAt, "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="text-center">
                  {item.enterpriser.companyName}
                </TableCell>
                <TableCell className="text-center">
                  {item.enterpriser.phoneNumber}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Select
                      value={item.status}
                      onValueChange={(value: AdvertisingInquiryStatus) =>
                        handleStatusChange(item.id, value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  router.push(
                    `/advertising-inquiries?page=${meta?.previousPage || 1}`
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
                        router.push(`/advertising-inquiries?page=${pageNum}`);
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
                  router.push(
                    `/advertising-inquiries?page=${meta?.nextPage || 1}`
                  );
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
