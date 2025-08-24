"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { Link } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function LinkButton({ editor, disabled }: Props) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      className={cn("rounded-md p-2", editor.isActive("bold") && "bg-gray-100")}
      onClick={() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
          return;
        }

        // empty
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();

          return;
        }

        // update link
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }}
      disabled={disabled}
    >
      <Link className="h-4 w-4" />
    </Button>
  );
}
