"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { GetLineAds } from "@/actions/admin/lender-ad-management/get-line-ads";
import { updateLineAds } from "@/actions/admin/lender-ad-management/update-line-ads";

type Props = {
  lineAds: GetLineAds["lineAds"];
};

export default function LineAdTab({ lineAds }: Props) {
  const [loading, startTransition] = useTransition();

  const [adData, setAdData] = useState<GetLineAds["lineAds"]>(lineAds);

  const handleInputChange = (
    index: number,
    field: keyof GetLineAds["lineAds"][0],
    value: string
  ) => {
    const newAdData = [...adData];
    newAdData[index] = { ...newAdData[index], [field]: value };
    setAdData(newAdData);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateLineAds(
        adData.map((item) => ({
          id: item.id,
          region: item.region,
          title1: item.title1,
          title2: item.title2,
          lenderName: item.lenderName,
          link: item.link,
        }))
      );

      if (result.success) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  return (
    <TabsContent value="line-ad">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>줄 광고 관리</CardTitle>
              <CardDescription>
                메인 페이지 하단에 표시될 줄 광고를 관리합니다
              </CardDescription>
            </div>

            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
              disabled={loading}
            >
              {loading && <Spinner className="text-white" size={"small"} />}
              {loading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Line Ad Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {adData.map((ad, index) => {
                console.log(ad.link);
                return (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      {index + 1} 미리보기
                    </h3>

                    {/* Preview Card */}
                    <div
                      className="border-2 border-[#FFA015] rounded-xl p-3 w-full max-w-[600px] flex justify-between items-center text-sm text-gray-800 cursor-pointer"
                      onClick={() => {
                        if (!ad.link) {
                          toast.error("링크가 존재하지 않습니다.");
                          return;
                        }

                        window.open(`${ad.link}`, "_blank");
                      }}
                    >
                      {/* 왼쪽 */}
                      <div className="flex-1 min-w-0">
                        {/* 지역 뱃지 + 제목 */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#FFA015] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            {ad.region}
                          </span>
                          <span className="font-bold text-[#FFA015]">
                            {ad.title1}
                          </span>
                          <span className="ml-1 text-sm text-black">
                            {ad.title2}
                          </span>
                        </div>

                        {/* 날짜 + 시간 */}
                        <div className="text-xs text-gray-500">
                          {ad.createdAt} · {ad.distanceToNow}
                        </div>
                      </div>

                      {/* 오른쪽 타이틀 */}
                      <div className="text-xs font-bold text-[#FFA015] whitespace-nowrap">
                        {ad.lenderName}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor={`region-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          지역명
                        </Label>
                        <Input
                          id={`region-${index}`}
                          value={ad.region}
                          onChange={(e) =>
                            handleInputChange(index, "region", e.target.value)
                          }
                          placeholder=""
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`first-title-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          첫번째 타이틀
                        </Label>
                        <Input
                          id={`first-title-${index}`}
                          value={ad.title1}
                          onChange={(e) =>
                            handleInputChange(index, "title1", e.target.value)
                          }
                          placeholder=""
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`second-title-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          두번째 타이틀
                        </Label>
                        <Input
                          id={`second-title-${index}`}
                          value={ad.title2}
                          onChange={(e) =>
                            handleInputChange(index, "title2", e.target.value)
                          }
                          placeholder=""
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`company-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          대출업체 이름
                        </Label>
                        <Input
                          id={`company-${index}`}
                          value={ad.lenderName}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "lenderName",
                              e.target.value
                            )
                          }
                          placeholder=""
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`link-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          링크
                        </Label>
                        <Input
                          id={`link-${index}`}
                          value={ad.link}
                          onChange={(e) =>
                            handleInputChange(index, "link", e.target.value)
                          }
                          placeholder=""
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
