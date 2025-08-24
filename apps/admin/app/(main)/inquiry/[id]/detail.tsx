"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { GetInquiry } from "@/actions/admin/get-inquiry";
import { convertInquiryKindToKor } from "@/lib/utils";
import { deleteInquiry } from "@/actions/admin/delete-inquiry";

type Props = {
  data: GetInquiry;
};

export default function Detail({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  const [loading, startTransition] = useTransition();

  const [formData] = useState({
    title: data?.title || "",
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    inquiryKind: data?.inquiryKind,
    content: data?.content || ``,
    createdAt: data?.createdAt ? format(data?.createdAt, "yyyy-MM-dd") : "",
  });

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await deleteInquiry(Number(params.id));

      if (result) {
        router.back();

        toast.success("삭제가 완료되었습니다!");
      } else {
        toast.error("삭제를 실패했습니다.");
      }
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 text-white px-6"
          disabled={loading}
        >
          {loading && <Spinner className="text-white" size={"small"} />}
          {loading ? "삭제 중..." : "삭제"}
        </Button>
      </div>

      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        {/* Left Form Section */}
        <div className="w-96 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              제목
            </Label>
            <Input
              id="title"
              value={formData.title}
              className="pr-16"
              maxLength={30}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              이름
            </Label>
            <Input id="name" value={formData.name} readOnly />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="regionKind"
              className="text-sm font-medium text-gray-700"
            >
              문의유형
            </Label>
            <Input
              id="inquiryKind"
              value={
                formData.inquiryKind
                  ? convertInquiryKindToKor(formData.inquiryKind)
                  : ""
              }
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="isJob"
              className="text-sm font-medium text-gray-700"
            >
              휴대폰 번호
            </Label>
            <Input id="phoneNumber" value={formData.phoneNumber} readOnly />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="createdAt"
              className="text-sm font-medium text-gray-700"
            >
              작성일시
            </Label>
            <Input id="createdAt" value={formData.createdAt} readOnly />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="flex-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-medium text-gray-900">문의내용</h2>
              </div>

              <div className="bg-orange-50  rounded-lg  overflow-y-auto">
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  <Textarea
                    value={formData.content}
                    className="w-full h-96 resize-none rounded-lg"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
