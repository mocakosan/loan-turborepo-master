"use client";

import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { setComma } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { GetAdvertisingGuide } from "@/actions/admin/get-advertising-guide";
import { updateAdvertisingGuide } from "@/actions/admin/update-advertising-guide";
import { deleteAdvertisingGuide } from "@/actions/admin/delete-advertising-guide";

type Props = {
  data: GetAdvertisingGuide;
};

export default function Detail({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  const [loading, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: data?.title || "",
    amount: data?.amount || 0,
    standard: data?.standard || "",
    position: data?.position || "",
    description: data?.description || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("첫번째 타이틀을 입력해주세요.");
      return;
    }

    if (!formData.amount) {
      toast.error("가격을 입력해주세요.");
      return;
    }

    if (!formData.standard.trim()) {
      toast.error("기준을 입력해주세요.");
      return;
    }

    if (!formData.position.trim()) {
      toast.error("광고위치를 입력해주세요.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await updateAdvertisingGuide(Number(params.id), {
        ...formData,
        amount: Number(formData.amount),
      });

      if (result.success) {
        toast.success("저장이 완료되었습니다.");

        router.back();
      } else {
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  const handleDelete = () => {
    const isConfirm = confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    startTransition(async () => {
      const result = await deleteAdvertisingGuide(Number(params.id));

      if (result) {
        router.back();

        toast.success("삭제가 완료되었습니다!");
      } else {
        toast.error("삭제를 실패했습니다.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={loading}
          >
            삭제
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600"
            disabled={loading}
          >
            {loading && <Spinner className="text-white" size={"small"} />}
            {loading ? "업로드 중..." : "업로드"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-600 text-sm">
                제목
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="pr-16"
                  maxLength={30}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {formData.title.length}/30
                </span>
              </div>
            </div>

            {/* amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-600 text-sm">
                가격
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="가격을 입력하세요"
              />
            </div>

            {/* Standard Field */}
            <div className="space-y-2">
              <Label htmlFor="standard" className="text-gray-600 text-sm">
                기준
              </Label>
              <Input
                id="standard"
                value={formData.standard}
                onChange={(e) => handleInputChange("standard", e.target.value)}
                placeholder="기준을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-600 text-sm">
                광고 위치
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="광고 위치를 입력하세요"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-600 text-sm">
                상품설명
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="상품설명을 입력하세요"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">미리 보기</h3>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {formData.title}
                </h4>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-orange-500">
                    {setComma(formData.amount)}원
                  </span>
                  <span className="text-gray-600">( {formData.standard} )</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      광고 위치
                    </span>
                    <span className="text-sm text-gray-700">
                      {formData.position}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      상품 설명
                    </span>
                    <span className="text-sm text-gray-700">
                      {formData.description}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
