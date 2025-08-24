"use client";

import React from "react";

import { Editor } from "@tiptap/react";
import { Table2 } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

type Props = {
  editor: Editor;
  disabled?: boolean;
};

export default function TableButton({ editor, disabled = false }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("rounded-md p-2")} disabled={disabled}>
        <Table2 className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-[200px] overflow-y-scroll">
        <DropdownMenuItem>
          <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: true,
                })
                .run()
            }
          >
            테이블 추가
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            컬럼 전에 추가
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
            컬럼 뒤에 추가
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().deleteColumn().run()}>
            컬럼 삭제
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().addRowBefore().run()}>
            행 전에 추가
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().addRowAfter().run()}>
            행 뒤에 추가
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().deleteRow().run()}>
            행 삭제
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => editor.chain().focus().deleteTable().run()}>
            테이블 삭제
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
