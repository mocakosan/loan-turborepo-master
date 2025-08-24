"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ImageIcon,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetInquiry } from "@/actions/admin/get-inquiry";

type Props = {
  data: GetInquiry;
};

export default function Detail({ data }: Props) {
  const [editorContent, setEditorContent] = useState(data?.reply || ``);
  const [fontSize, setFontSize] = useState("14");

  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    handleFormatting("fontSize", size);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              문의내용 삭제
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">업로드</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Inquiry Content */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-medium">문의내용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {data?.content}
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Answer Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">답변</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t-md bg-white">
                <div className="flex items-center gap-1 p-2 border-b border-gray-200">
                  {/* Font Size */}
                  <select
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                  </select>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Formatting Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("bold")}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("italic")}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("underline")}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("strikeThrough")}
                  >
                    <Strikethrough className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Alignment Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("justifyLeft")}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("justifyCenter")}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("justifyRight")}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("justifyFull")}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* List Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("insertUnorderedList")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleFormatting("insertOrderedList")}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Media Buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      const url = prompt("이미지 URL을 입력하세요:");
                      if (url) handleFormatting("insertImage", url);
                    }}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      const url = prompt("링크 URL을 입력하세요:");
                      if (url) handleFormatting("createLink", url);
                    }}
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor */}
              <div
                contentEditable
                className="min-h-[500px] p-4 border border-t-0 border-gray-300 rounded-b-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: editorContent }}
                onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                suppressContentEditableWarning={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
