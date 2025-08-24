"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { UnderlineIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function UnderlineButton({ editor, disabled = false }: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn(
        "rounded-md p-2",
        editor.isActive("underline") && "bg-gray-100",
      )}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      disabled={disabled}
    >
      <UnderlineIcon className="h-4 w-4" />
    </Button>
  );
}
