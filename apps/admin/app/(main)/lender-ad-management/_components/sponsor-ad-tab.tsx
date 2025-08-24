"use client";

import { useEffect, useState, useTransition } from "react";
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
import { GetSponsorAds } from "@/actions/admin/sponsor-ad/get-sponsor-ads";
import Link from "next/link";
import { toast } from "sonner";
import { updateSponsorAds } from "@/actions/admin/sponsor-ad/update-sponsor-ads";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  sponsorAds: GetSponsorAds["sponsorAds"];
};

export default function SponsorAdTab({ sponsorAds }: Props) {
  const [loading, startTransition] = useTransition();

  const [adData, setAdData] = useState<GetSponsorAds["sponsorAds"]>(sponsorAds);

  const handleInputChange = (
    index: number,
    field: keyof GetSponsorAds["sponsorAds"][0],
    value: string
  ) => {
    const newAdData = [...adData];
    newAdData[index] = { ...newAdData[index], [field]: value };
    setAdData(newAdData);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSponsorAds(adData);

      if (result.success) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  return (
    <TabsContent value="sponsor-ad">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>스폰서 광고 관리</CardTitle>
              <CardDescription>
                메인 페이지 좌측에 표시될 플로팅 광고를 관리합니다
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
          {/* Sponsor Ad Section */}
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
                    <Card className="border border-gray-200 rounded-[10px] p-0 max-w-[118px] gap-0 text-[12px]">
                      <CardHeader className="bg-orange-400 text-white p-2 rounded-t-[10px] gap-0">
                        <h4 className="text-center font-medium">
                          {ad.lenderName}
                        </h4>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-4 tex">
                        <div className="text-center space-y-0">
                          <p className="text-gray-600">{ad.title1}</p>
                          <p className="text-gray-600">{ad.title2}</p>
                        </div>
                        <div className="flex justify-center">
                          <Link href={ad.link} target="_blank">
                            <Button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-bold">
                              바로가기
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Form Fields */}
                    <div className="space-y-4">
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
                          htmlFor={`link-${index}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          바로가기 링크
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
