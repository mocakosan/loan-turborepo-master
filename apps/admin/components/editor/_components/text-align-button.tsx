"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function TextAlignButton({ editor, disabled = false }: Props) {
  return (
    <React.Fragment>
      <Button
        type="button"
        variant={"ghost"}
        className={cn(
          "rounded-md p-2",
          editor.isActive({ textAlign: "left" }) && "bg-gray-100",
        )}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        disabled={disabled}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={"ghost"}
        className={cn(
          "rounded-md p-2",
          editor.isActive({ textAlign: "center" }) && "bg-gray-100",
        )}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        disabled={disabled}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={"ghost"}
        className={cn(
          "rounded-md p-2",
          editor.isActive({ textAlign: "right" }) && "bg-gray-100",
        )}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        disabled={disabled}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </React.Fragment>
  );
}
