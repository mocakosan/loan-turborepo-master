"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { Strikethrough } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function StrikethroughButton({
  editor,
  disabled = false,
}: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn(
        "rounded-md p-2",
        editor.isActive("strike") && "bg-gray-100",
      )}
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={disabled}
    >
      <Strikethrough className="h-4 w-4" />
    </Button>
  );
}
