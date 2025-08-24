"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { GetAllVisitor } from "@/actions/admin/visitor/get-all-visitor";
import { setComma } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateAllVisitor } from "@/actions/admin/visitor/update-all-visitor";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  data: GetAllVisitor;
};

export default function Visitor({ data }: Props) {
  const [loading, startTransition] = useTransition();

  const [autoMode, setAutoMode] = useState(data.isAuto || false);
  const [counts, setCounts] = useState({
    today: data.todayCount,
    total: data.totalCount,
    loanInquiry: data.loanInquiryCount,
  });

  const handleSave = () => {
    if (!counts.today || !counts.total || !counts.loanInquiry) {
      toast.error("모든 값을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await updateAllVisitor({
        todayCount: counts.today,
        totalCount: counts.total,
        loanInquiryCount: counts.loanInquiry,
        isAuto: autoMode,
      });

      if (result) {
        toast.success("저장이 완료되었습니다.");
      } else {
        toast.error("저장 실패");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">방문자 통계</h1>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-6"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && <Spinner className="text-white" size={"small"} />}
            {loading ? "저장 중..." : "저장"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  방문자 수
                </h2>

                {/* Today's Summary */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 text-lg">
                    <span className="font-semibold text-gray-900">Today</span>
                    <span className="text-gray-600">오늘 방문자</span>
                    <span className="font-bold text-orange-500">
                      {setComma(data.todayCount)}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">누적 방문자</span>
                    <span className="font-bold text-orange-500">
                      {setComma(data.totalCount)}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">실시간 대출문의</span>
                    <span className="font-bold text-orange-500">
                      {setComma(data.loanInquiryCount)}
                    </span>
                  </div>
                </div>

                {/* Individual Metrics */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">
                      오늘 방문자
                    </h3>
                    <Input
                      value={counts.today}
                      onChange={(e) =>
                        setCounts((prev) => ({
                          ...prev,
                          today: Number(e.target.value),
                        }))
                      }
                      type="number"
                      placeholder=""
                      className="mt-1"
                      disabled={autoMode}
                    />
                  </div>

                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">
                      누적 방문자
                    </h3>
                    <Input
                      value={counts.total}
                      onChange={(e) =>
                        setCounts((prev) => ({
                          ...prev,
                          total: Number(e.target.value),
                        }))
                      }
                      type="number"
                      placeholder=""
                      className="mt-1"
                      disabled={autoMode}
                    />
                  </div>

                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">
                      실시간 대출문의
                    </h3>
                    <Input
                      value={counts.loanInquiry}
                      onChange={(e) =>
                        setCounts((prev) => ({
                          ...prev,
                          loanInquiry: Number(e.target.value),
                        }))
                      }
                      type="number"
                      placeholder=""
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Auto Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-gray-900">
                    자동
                  </span>
                  <Switch
                    checked={autoMode}
                    onCheckedChange={setAutoMode}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {/* Description Text */}
                <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                  <p>자동으로 설정시</p>
                  <p>오늘 방문자 ( 1000 ~ 4000 )사이</p>
                  {/* FIXME: 기능제거 요청하여 주석 */}
                  {/* <p>실시간 대출문의 ( 1000 ~ 4000 )사이로</p> */}
                  <p>매일 자동 랜덤으로 자동으로 리셋</p>
                  <p className="pt-2">
                    누적방문자는 매일 오늘 방문자 설정값이 늘어나 설정됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
