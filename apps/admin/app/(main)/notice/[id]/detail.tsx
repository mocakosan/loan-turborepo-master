"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import TiptapEditor, {
  TiptapEditorExtension,
} from "@/components/editor/tiptap-editor";
import { GetNotice } from "@/actions/admin/get-notice";
import { updateNotice } from "@/actions/admin/update-notice";

type Props = {
  data: GetNotice;
};

export default function Detail({ data }: Props) {
  const router = useRouter();
  const params = useParams();
  const [loading, startTransition] = useTransition();

  const [title, setTitle] = useState(data?.title || "");
  const [content, setContent] = useState(data?.content || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setTitle(value);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleUpload = () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await updateNotice(Number(params.id), {
        title,
        content,
      });

      if (result.success) {
        toast.success("저장이 완료되었습니다.");
      } else {
        console.log(result);
        toast.error("저장 실패: " + result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-600 text-white px-6"
            disabled={loading}
          >
            {loading && <Spinner className="text-white" size={"small"} />}
            {loading ? "업로드 중..." : "업로드"}
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              제목
            </Label>
            <div className="relative">
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="pr-16"
                placeholder="제목을 입력하세요"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {title.length}/30
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <TiptapEditor
              extensions={[
                TiptapEditorExtension["font-size"],
                TiptapEditorExtension.bold,
                TiptapEditorExtension.italic,
                TiptapEditorExtension.underline,
                TiptapEditorExtension.strikethrough,
                TiptapEditorExtension["text-align"],
                // TiptapEditorExtension.upload,
                TiptapEditorExtension.link,
              ]}
              content={content}
              onChangeContent={(value) => {
                setContent(value);
              }}
              editable={!loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
