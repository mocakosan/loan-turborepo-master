"use client";

import { GetAdvertisingGuides } from "@/actions/admin/get-advertising-guides";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setComma } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  data: GetAdvertisingGuides;
};

export default function AdvertisingGuide({ data }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">업체 이용안내</h1>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();

              router.push(`/advertising-guide/add`);
            }}
          >
            메뉴 추가
          </Button>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-gray-300 mb-8"></div>

        {/* Service Cards */}
        <div className="space-y-6">
          {data.advertisingGuides.map((item, index) => {
            return (
              <Card
                key={index}
                className="bg-white shadow-sm border border-gray-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();

                  router.push(`/advertising-guide/${item.id}`);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h2>
                      <div className="text-2xl font-bold text-orange-500 mb-3">
                        {setComma(item.amount)}
                        <span className="text-lg">원</span>
                        <span className="text-sm text-gray-600 font-normal ml-1">
                          ({item.standard})
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {item.position && (
                          <p>
                            <span className="font-medium">광고 위치</span>{" "}
                            {item.position}
                          </p>
                        )}

                        <p>
                          <span className="font-medium">상품 설명</span>{" "}
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
