"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { BoldIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function BoldButton({ editor, disabled }: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn("rounded-md p-2", editor.isActive("bold") && "bg-gray-100")}
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={disabled}
    >
      <BoldIcon className="h-4 w-4" />
    </Button>
  );
}
