"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { ItalicIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function ItalicButton({ editor, disabled = false }: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn(
        "rounded-md p-2",
        editor.isActive("italic") && "bg-gray-100",
      )}
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={disabled}
    >
      <ItalicIcon className="h-4 w-4" />
    </Button>
  );
}
