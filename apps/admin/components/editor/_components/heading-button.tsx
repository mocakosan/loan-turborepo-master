"use client";

import React from "react";

import { Level } from "@tiptap/extension-heading";
import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function HeadingButton({ editor, disabled = false }: Props) {
  return (
    <React.Fragment>
      {[
        {
          icon: <Heading1 className="h-4 w-4" />,
          level: 1,
        },
        {
          icon: <Heading2 className="h-4 w-4" />,
          level: 2,
        },
        {
          icon: <Heading3 className="h-4 w-4" />,
          level: 3,
        },
      ].map((item, i) => {
        return (
          <Button
            key={i}
            type="button"
            variant={"ghost"}
            className={cn(
              "rounded-md p-2",
              editor.isActive("heading", { level: item.level }) &&
                "bg-gray-100",
            )}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: item.level as Level })
                .run()
            }
            disabled={disabled}
          >
            {item.icon}
          </Button>
        );
      })}
    </React.Fragment>
  );
}
