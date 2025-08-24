"use client";

import React from "react";

import { Editor } from "@tiptap/react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function FontSizeButton({ editor, disabled = false }: Props) {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled}>
        <Button
          type="button"
          variant={"ghost"}
          className={cn(
            "rounded-md p-2 text-gray-950",
            editor.isActive("textStyle", {
              fontSize: editor.getAttributes("textStyle").fontSize,
            }) && "bg-gray-100",
          )}
          disabled={true}
        >
          {editor.getAttributes("textStyle").fontSize ?? "16px"}
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea className="h-72 w-48 rounded-md border">
          {[16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128].map((value) => (
            <>
              <div
                key={value}
                className={cn("cursor-pointer text-sm")}
                onClick={() => editor.chain().focus().setFontSize(value).run()}
              >
                {`${value}px`}
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
