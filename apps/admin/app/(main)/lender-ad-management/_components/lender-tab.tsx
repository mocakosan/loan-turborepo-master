"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import JobCard from "@/components/job-card";
import { useRouter } from "next/navigation";
import {
  getMainList,
  GetMainList,
} from "@/actions/admin/main-list/get-main-list";
import { useEffect, useState, useTransition } from "react";
import { deleteLender } from "@/actions/admin/lender-ad-management/delete-lender";
import { toast } from "sonner";
import { GetRegionKinds } from "@/actions/admin/get-region-kinds";
import { Input } from "@/components/ui/input";
import { GetLoanKinds } from "@/actions/admin/get-loan-kinds";

type Props = {
  regionKinds: GetRegionKinds["regionKinds"];
  loanKinds: GetLoanKinds["loanKinds"];
};

export default function LenderTab(props: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>(
    undefined
  );
  const [selectedLoanId, setSelectedLoanId] = useState<number | undefined>(
    undefined
  );
  const [lenders, setLenders] = useState<GetMainList["lenders"]>([]);

  useEffect(() => {
    loadGetLenders();
  }, [selectedRegionId, selectedLoanId, searchTerm]);

  const loadGetLenders = async () => {
    try {
      const result = await getMainList({
        searchTerm,
        regionKindId: selectedRegionId,
        loanKindId: selectedLoanId,
      });

      setLenders(result?.lenders || []);
    } catch (error) {
      console.error("loadGetLenders error:", error);
    }
  };

  // 대출업체 관련 함수
  const handleAddCompany = () => {
    router.push(`/lender-ad-management/main-list/add`);
  };

  const handleEditCompany = (company: GetMainList["lenders"][0]) => {
    router.push(`/lender-ad-management/main-list/${company.id}`);
  };

  const handleDeleteCompany = (id: number) => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    startTransition(async () => {
      const result = await deleteLender({ id });

      if (result) {
        toast.success("삭제가 완료되었습니다.");
      } else {
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <TabsContent value="companies">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>대출업체 목록</CardTitle>
              <CardDescription>
                대출업체 관리 및 메인광고 설정등록된 대출업체의 정보를 관리하고,
                메인 페이지 광고 노출 여부를 설정할 수 있습니다.
              </CardDescription>
            </div>
            <Button onClick={handleAddCompany}>
              <Plus className="w-4 h-4 mr-2" />
              업체 추가
            </Button>
          </div>

          <div className="border-y p-3 mt-6">
            <div className="relative h-9">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="검색어를 입력해 주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="bg-white border-b flex flex-row py-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedRegionId(undefined)}
                className={`whitespace-nowrap text-sm px-2 py-1 rounded transition-colors ${
                  !selectedRegionId
                    ? "text-green-600 bg-green-50 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                전체
              </button>
              {props.regionKinds.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRegionId(item.id)}
                  className={`whitespace-nowrap text-sm px-2 py-1 rounded transition-colors ${
                    selectedRegionId === item.id
                      ? "text-green-600 bg-green-50 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border-b flex flex-row py-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedLoanId(undefined)}
                className={`whitespace-nowrap text-sm px-2 py-1 rounded transition-colors ${
                  !selectedLoanId
                    ? "text-green-600 bg-green-50 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                전체
              </button>
              {props.loanKinds.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedLoanId(item.id)}
                  className={`whitespace-nowrap text-sm px-2 py-1 rounded transition-colors ${
                    selectedLoanId === item.id
                      ? "text-green-600 bg-green-50 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-4 gap-y-7">
            {lenders.map((company, index) => (
              <div
                key={index}
                className="max-w-[200px] w-full flex flex-col justify-between"
              >
                <JobCard
                  {...company}
                  onClick={() => {
                    window.open(
                      `http://1.234.44.13/enterprise/enterprise_details/${company.id}`,
                      "_blank"
                    );
                  }}
                />

                <div className="space-y-2">
                  <div className="flex justify-between mt-2">
                    <div className="flex flex-col justify-center gap-y-1">
                      <Badge
                        variant={
                          company.isVisibleMain ? "default" : "destructive"
                        }
                      >
                        {company.isVisibleMain
                          ? "메인광고 활성"
                          : "메인광고 비활성"}
                      </Badge>
                      <Badge
                        variant={
                          company.isVisibleArea ? "default" : "destructive"
                        }
                      >
                        {company.isVisibleArea
                          ? "지역광고 활성"
                          : "지역광고 비활성"}
                      </Badge>
                      <Badge
                        variant={
                          company.isVisibleLoan ? "default" : "destructive"
                        }
                      >
                        {company.isVisibleLoan
                          ? "상품광고 활성"
                          : "상품광고 비활성"}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCompany(company)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* <div className="text-sm">
                    {company.isVisibleMain
                      ? "메인 광고 영역에 노출됩니다."
                      : "메인 광고 노출에서 제외됩니다."}
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
