"use client";

import React from "react";

import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function ColorButton({ editor, disabled = false }: Props) {
  return (
    <div className="flex items-center">
      <input
        type="color"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          return editor.chain().focus().setColor(event.target.value).run();
        }}
        value={editor.getAttributes("textStyle").color}
        data-testid="setColor"
        disabled={disabled}
      />
    </div>
  );
}
