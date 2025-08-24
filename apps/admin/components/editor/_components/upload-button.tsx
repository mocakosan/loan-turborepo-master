"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { ImageUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type Props = {
  editor: Editor;
  onClick: () => void;
  disabled?: boolean;
};

export default function UploadButton({
  editor,
  onClick,
  disabled = false,
}: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn(
        "rounded-md p-2",
        editor.isActive("image") && "bg-gray-100",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <ImageUp className="h-4 w-4" />
    </Button>
  );
}
