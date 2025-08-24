"use client";

import { useState, useTransition } from "react";
import { Search, Edit3, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GetAllEnterpriser } from "@/actions/admin/loan-inquiry-registration/get-all-enterpriser";
import {
  differenceInCalendarDays,
  format,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";
import { createLoanInquiryRegistration } from "@/actions/admin/loan-inquiry-registration/create-loan-inquiry-registration";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteLoanInquiryRegistration } from "@/actions/admin/loan-inquiry-registration/delete-loan-inquiry-registration";

type Props = {
  data: GetAllEnterpriser;
};

export default function CompanyRegistration({ data }: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [selectedCompany, setSelectedCompany] = useState<
    GetAllEnterpriser["enterprisers"][0] | null
  >(data.enterprisers[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [registrationInput, setRegistrationInput] = useState("");
  const [startDateInput, setStartDateInput] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDateInput, setEndDateInput] = useState("");

  const filteredCompanies = data.enterprisers.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanySelect = (
    company: GetAllEnterpriser["enterprisers"][0]
  ) => {
    setSelectedCompany(company);
    setRegistrationInput("");
    setStartDateInput(format(new Date(), "yyyy-MM-dd"));
    setEndDateInput("");
  };

  const handleRegistrationSubmit = () => {
    if (
      selectedCompany &&
      registrationInput &&
      startDateInput &&
      endDateInput
    ) {
      const count = Number.parseInt(registrationInput) || 0;

      if (count === 0) {
        toast.error("등록횟수를 입력해주세요.");
        return;
      }

      if (!startDateInput) {
        toast.error("시작일을 입력해주세요.");
        return;
      }

      if (!endDateInput) {
        toast.error("종료일을 입력해주세요.");
        return;
      }

      startTransition(async () => {
        const result = await createLoanInquiryRegistration({
          count,
          startedAt: new Date(startDateInput),
          endedAt: new Date(endDateInput),
          enterpriserId: selectedCompany.id,
        });
        if (result.success) {
          toast.success("저장이 완료되었습니다.");
          router.refresh();
          setRegistrationInput("");
          setStartDateInput(format(new Date(), "yyyy-MM-dd"));
          setEndDateInput("");
        } else {
          console.log(result);
          toast.error("저장 실패: " + result.message);
        }
      });
    }
  };

  const handleDeleteRecord = (loanInquiryRegistrationId: number) => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    const recordToDelete = data.enterprisers.find((item) =>
      item.loanInquiryRegistrations.some(
        (value) => value.id === loanInquiryRegistrationId
      )
    );
    if (!recordToDelete) {
      toast.error("삭제할 이력을 찾기 못했습니다.");
      return;
    }

    startTransition(async () => {
      const result = await deleteLoanInquiryRegistration({
        id: loanInquiryRegistrationId,
      });

      if (result) {
        toast.success("삭제가 완료되었습니다!");

        router.refresh();
      } else {
        toast.error("삭제를 실패했습니다.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            등록된 대출업체 목록
          </h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="업체명을 입력해 주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Company List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {filteredCompanies.map((company) => {
                const remainCount = company.loanInquiryRegistrations.reduce(
                  (sum, item) => {
                    if (isAfter(startOfDay(new Date()), item.endedAt)) {
                      return sum;
                    }

                    if (item._count.loanInquiries === item.count) {
                      return sum;
                    }

                    return sum + (item.count - item._count.loanInquiries);
                  },
                  0
                );

                return (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedCompany?.id === company.id
                        ? "ring-2 ring-green-400 bg-green-50 border-green-200"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handleCompanySelect(company)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">
                            {company.companyName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-gray-900">
                            {remainCount}회
                          </span>
                          <Edit3 className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Registration Form */}
          <div className="space-y-6">
            <Card className="p-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  실시간 대출업체 기간 및 횟수 설정
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="company-name"
                      className="text-sm font-medium text-gray-700"
                    >
                      업체 이름
                    </Label>
                    <Input
                      id="company-name"
                      value={
                        selectedCompany?.companyName || "업체를 선택하세요"
                      }
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>

                  {/* <div className="grid grid-cols-2 gap-3"> */}
                  <div>
                    <Label
                      htmlFor="registration-count"
                      className="text-sm font-medium text-gray-700"
                    >
                      등록횟수
                    </Label>
                    <Input
                      id="registration-count"
                      type="number"
                      value={registrationInput}
                      onChange={(e) => setRegistrationInput(e.target.value)}
                      className="mt-1"
                      placeholder="횟수"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="start-date"
                        className="text-sm font-medium text-gray-700"
                      >
                        시작일
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDateInput}
                        onChange={(e) => setStartDateInput(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="end-date"
                        className="text-sm font-medium text-gray-700"
                      >
                        종료일
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDateInput}
                        onChange={(e) => setEndDateInput(e.target.value)}
                        min={startDateInput}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {startDateInput && endDateInput && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      총 사용기간:{" "}
                      <span className="font-bold">
                        {differenceInCalendarDays(
                          parseISO(endDateInput),
                          parseISO(startDateInput)
                        )}
                        일
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={handleRegistrationSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={
                      !selectedCompany ||
                      !registrationInput ||
                      !startDateInput ||
                      !endDateInput ||
                      loading
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    등록하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registration Records */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  등록 이력
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {!selectedCompany ? (
                    <p className="text-gray-500 text-center py-4">
                      등록 이력이 없습니다.
                    </p>
                  ) : (
                    data.enterprisers
                      .find((item) => item.id === selectedCompany.id)
                      ?.loanInquiryRegistrations.map((record, index) => {
                        const today = startOfDay(new Date());
                        const companyName = data.enterprisers.find(
                          (item) => item.id === selectedCompany.id
                        )?.companyName;

                        const startDate = new Date(record.createdAt);
                        const endDate = record.endedAt;

                        const isExpired = isAfter(today, endDate);
                        const isAllUsed =
                          record._count.loanInquiries === record.count;

                        const startToEnd = differenceInCalendarDays(
                          endDate,
                          startDate
                        );
                        const todayToEnd = differenceInCalendarDays(
                          endDate,
                          today
                        );

                        const usedCount = record._count.loanInquiries;

                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 hover:bg-gray-50 ${
                              isExpired
                                ? "border-red-200 bg-red-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {companyName}
                                  </h4>
                                  <div className="flex items-center space-x-2">
                                    {isExpired ? (
                                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                        만료됨
                                      </span>
                                    ) : isAllUsed ? (
                                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                        모두사용
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                        {todayToEnd}일 남음
                                      </span>
                                    )}
                                    <Button
                                      onClick={() =>
                                        handleDeleteRecord(record.id)
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      disabled={loading}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>
                                    등록횟수:{" "}
                                    <span className="font-medium">
                                      {record.count}회
                                    </span>
                                  </p>
                                  <p>
                                    사용기간:{" "}
                                    <span className="font-medium text-blue-600">
                                      {startToEnd}일
                                    </span>
                                  </p>
                                  <p>
                                    사용횟수:{" "}
                                    <span className="font-medium">
                                      {usedCount}회
                                    </span>
                                  </p>
                                  <p>
                                    시작일:{" "}
                                    {startDate.toLocaleDateString("ko-KR")}
                                  </p>
                                  <p>
                                    종료일:{" "}
                                    {endDate.toLocaleDateString("ko-KR")}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    등록일시:{" "}
                                    {record.createdAt.toLocaleString("ko-KR")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
